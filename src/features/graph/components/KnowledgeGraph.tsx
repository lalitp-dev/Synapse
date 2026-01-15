import React, { useState, useCallback } from "react";
import { View, Dimensions } from "react-native";
import { Canvas, Circle, Line, Group, vec } from "@shopify/react-native-skia";
import { useRouter } from "expo-router";
import * as d3 from "d3-force";
import { useFocusEffect } from "expo-router";
import { GraphService } from "../services/GraphService";
import { useAuthStore } from "../../auth/store/useAuthStore";

// FIX 1: Import Gesture Handler
import { Gesture, GestureDetector } from "react-native-gesture-handler";
// FIX 2: Import runOnJS from Reanimated
import { runOnJS } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export const KnowledgeGraph = () => {
  const session = useAuthStore((state) => state.session);
  const router = useRouter();

  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

  // 1. Navigation Helper (Runs on JS Thread)
  const navigateToNote = (id: string) => {
    console.log("Navigating to note:", id);
    router.push(`/note/${id}`);
  };

  // 2. Gesture Logic (The New "Senior" Way)
  const tapGesture = Gesture.Tap()
    .onStart((e) => {
      // Get touch coordinates
      const x = e.x;
      const y = e.y;

      // Check every node to see if we tapped it
      for (const node of nodes) {
        // Distance Formula
        const dist = Math.sqrt(
          Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
        );

        // If distance < radius + padding, it's a click
        if (dist < node.r + 15) {
          // Must switch threads to navigate
          runOnJS(navigateToNote)(node.id);
          break;
        }
      }
    })
    .runOnJS(true); // Ensure the gesture itself allows JS callbacks

  // 3. Load Data & Physics
  useFocusEffect(
    useCallback(() => {
      let simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>;

      const loadData = async () => {
        if (!session?.user.id) return;

        const data = await GraphService.fetchGraphData(session.user.id);

        if (data.nodes.length === 0) return;

        const simulationNodes = data.nodes.map((n) => ({ ...n }));
        const simulationLinks = data.links.map((l) => ({ ...l }));

        simulation = d3
          .forceSimulation(simulationNodes as any)
          .force("charge", d3.forceManyBody().strength(-200))
          .force("center", d3.forceCenter(width / 2, height / 3))
          .force("collide", d3.forceCollide(30))
          .force(
            "link",
            d3
              .forceLink(simulationLinks)
              .id((d: any) => d.id)
              .distance(100)
          )
          .on("tick", () => {
            setNodes([...simulationNodes]);
            setLinks([...simulationLinks]);
          });
      };

      loadData();
      return () => {
        if (simulation) simulation.stop();
      };
    }, [session])
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Wrap Canvas in GestureDetector to catch taps */}
      <GestureDetector gesture={tapGesture}>
        <Canvas style={{ flex: 1 }}>
          {/* Draw Links */}
          {links.map((link: any, i) => {
            if (!link.source.x || !link.target.x) return null;
            return (
              <Line
                key={`link-${i}`}
                p1={vec(link.source.x, link.source.y)}
                p2={vec(link.target.x, link.target.y)}
                color="rgba(79, 70, 229, 0.2)"
                strokeWidth={2}
              />
            );
          })}

          {/* Draw Nodes */}
          {nodes.map((node: any, i) => (
            <Group key={`node-${i}`}>
              <Circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                color={node.color || "#4F46E5"}
              />
              <Circle
                cx={node.x}
                cy={node.y}
                r={3}
                color="rgba(255,255,255,0.3)"
              />
            </Group>
          ))}
        </Canvas>
      </GestureDetector>
    </View>
  );
};
