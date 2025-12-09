// Module 1: Configuration & State Management
const defaultConfig = {
  main_title: "AI Agent Builder Studio",
  subtitle: "Design AI pipelines visually. Drag, connect, and deploy intelligent agents.",
  cta_primary: "Start Building",
  cta_secondary: "Explore Examples"
};

let nodeIdCounter = 0;
let selectedNode = null;
let draggedNode = null;
let nodes = [];
