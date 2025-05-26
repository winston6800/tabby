import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReactFlowProvider } from "reactflow";
import { useNavigate } from "react-router-dom";

import NodeCanvas from "./components/NodeCanvas";

vi.mock("./components/FocusMode", () => ({
  __esModule: true,
  default: () => <div>FocusMode Component</div>,
}));

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("./store/nodeStore", () => ({
  __esModule: true,
  default: vi.fn(),
}));

import useNodeStore from "./store/nodeStore";

describe("NodeCanvas", () => {
  const mockAddNode = vi.fn();
  const mockOnNodesChange = vi.fn();
  const mockOnEdgesChange = vi.fn();
  const mockOnConnect = vi.fn();
  const mockSaveToLocalStorage = vi.fn();
  const mockSelectNode = vi.fn();
  const mockToggleMode = vi.fn();
  const mockNavigate = vi.fn();

  const getMockState = (overrides = {}) => ({
    nodes: [{ id: "1", data: { label: "Node 1" }, position: { x: 0, y: 0 } }],
    edges: [],
    addNode: mockAddNode,
    onNodesChange: mockOnNodesChange,
    onEdgesChange: mockOnEdgesChange,
    onConnect: mockOnConnect,
    saveToLocalStorage: mockSaveToLocalStorage,
    selectNode: mockSelectNode,
    isFocusMode: false,
    toggleMode: mockToggleMode,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);

    useNodeStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(getMockState());
      }
      return getMockState();
    });
  });

  const renderComponent = () =>
    render(
      <ReactFlowProvider>
        <NodeCanvas nodeTypes={{}} />
      </ReactFlowProvider>
    );

  it("renders buttons and ReactFlow components", () => {
    renderComponent();

    expect(screen.getByText("Add Node")).toBeInTheDocument();
    expect(screen.getByText("Focus Mode")).toBeInTheDocument();
    expect(screen.getByText("Save Progress")).toBeInTheDocument();
    expect(
      document.querySelector(".react-flow__background")
    ).toBeInTheDocument();
    expect(document.querySelector(".react-flow__controls")).toBeInTheDocument();
    expect(document.querySelector(".react-flow__minimap")).toBeInTheDocument();
  });

  it("renders FocusMode component when isFocusMode is true", () => {
    useNodeStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(
          getMockState({ isFocusMode: true, nodes: [], edges: [] })
        );
      }
      return getMockState({ isFocusMode: true, nodes: [], edges: [] });
    });
    renderComponent();
    expect(screen.getByText(/focusmode component/i)).toBeInTheDocument();
  });

  it("calls addNode and saveToLocalStorage when Add Node button clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Add Node"));
    expect(mockAddNode).toHaveBeenCalled();
    expect(mockSaveToLocalStorage).toHaveBeenCalled();
  });

  it("calls toggleMode when Focus Mode button clicked", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Focus Mode"));
    expect(mockToggleMode).toHaveBeenCalled();
  });

  it('calls navigate("/login") when Save Progress button clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText("Save Progress"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("calls selectNode when onNodeClick handler is invoked", () => {
    const state = getMockState();
    state.selectNode("1");
    expect(mockSelectNode).toHaveBeenCalledWith("1");
  });
});
