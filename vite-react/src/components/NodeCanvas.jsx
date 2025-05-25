import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import useNodeStore from "../store/nodeStore";
import SidebarEditor from "./SidebarEditor";
import FocusMode from "./FocusMode";
import "reactflow/dist/style.css";

// NodeCanvas: Main canvas for displaying and interacting with nodes and edges using ReactFlow.
// Handles node creation, selection, and renders the sidebar editor for node editing.
// Integrates with Zustand store for state management.
const NodeCanvas = ({ nodeTypes }) => {
  const navigate = useNavigate();
  const {
    nodes,
    edges,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveToLocalStorage,
    selectNode,
    isFocusMode,
    toggleMode,
  } = useNodeStore();

  const handleAddNode = useCallback(() => {
    addNode({
      title: "New Node",
      tags: ["new"],
      color: "#ffffff",
      size: 200,
    });
    saveToLocalStorage();
  }, [addNode, saveToLocalStorage]);

  const onNodeClick = useCallback(
    (event, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  // Save Progress button handler
  const handleSaveProgress = () => {
    navigate("/login");
  };

  // Handles what to display to user when the user is already logged in.
  // Use this as reference for future login requirements
const userLoginStatus = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return (
      <button
        onClick={handleSaveProgress}
        style={{
          padding: "8px 16px",
          background: "#7a77ff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Save Progress
      </button>
    );
  } else {
    // decode username safely
    let username = "User";
    username = JSON.parse(atob(token.split(".")[1])).username || "User";

    const handleSignOut = () => {
      localStorage.removeItem("authToken");
      navigate("/login");
    };

    return (
      <>
        <div
          style={{
            padding: "8px 16px",
            background: "#7a77ff",
            color: "white",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          Welcome, {username}
        </div>
        <button
          onClick={handleSignOut}
          style={{
            padding: "8px 16px",
            background: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </>
    );
  }
};


  return (
    <main style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 5,
          display: "flex",
          gap: 10,
        }}
      >
        <button
          onClick={handleAddNode}
          style={{
            padding: "8px 16px",
            background: "#1a192b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Node
        </button>
        <button
          onClick={toggleMode}
          style={{
            padding: "8px 16px",
            background: isFocusMode ? "#e74c3c" : "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isFocusMode ? "Edit Mode" : "Focus Mode"}
        </button>
        {userLoginStatus()}
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      {isFocusMode ? <FocusMode /> : <SidebarEditor />}
    </main>
  );
};

export default NodeCanvas;
