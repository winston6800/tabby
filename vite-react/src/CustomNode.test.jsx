import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReactFlowProvider } from "reactflow";
import CustomNode from "./components/CustomNode";

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

vi.mock("./store/nodeStore", () => ({
  __esModule: true,
  default: vi.fn(),
}));

import useNodeStore from "./store/nodeStore";
const mockedUseNodeStore = useNodeStore;

describe("CustomNode", () => {
  const mockSelectNode = vi.fn();

  const mockData = {
    title: "Test Node",
    color: "#abcdef",
    size: 150,
    tags: ["tag1", "tag2"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and tags", () => {
    mockedUseNodeStore.mockImplementation((selector) =>
      selector({ isFocusMode: false, selectNode: mockSelectNode })
    );

    render(
      <ReactFlowProvider>
        <CustomNode data={mockData} id="node-1" />
      </ReactFlowProvider>
    );

    expect(screen.getByText("Test Node")).toBeInTheDocument();
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("does not call selectNode when not in focus mode", () => {
    mockedUseNodeStore.mockImplementation((selector) =>
      selector({ isFocusMode: false, selectNode: mockSelectNode })
    );

    render(
      <ReactFlowProvider>
        <CustomNode data={mockData} id="node-1" />
      </ReactFlowProvider>
    );

    fireEvent.click(screen.getByText("Test Node"));
    expect(mockSelectNode).not.toHaveBeenCalled();
  });

  it("calls selectNode when in focus mode and clicked", () => {
    mockedUseNodeStore.mockImplementation((selector) =>
      selector({ isFocusMode: true, selectNode: mockSelectNode })
    );

    render(
      <ReactFlowProvider>
        <CustomNode data={mockData} id="node-1" />
      </ReactFlowProvider>
    );

    fireEvent.click(screen.getByText("Test Node"));
    expect(mockSelectNode).toHaveBeenCalledWith("node-1");
  });

  it("does not render tags section if no tags are provided", () => {
    mockedUseNodeStore.mockImplementation((selector) =>
      selector({ isFocusMode: false, selectNode: mockSelectNode })
    );

    const dataWithoutTags = { ...mockData, tags: [] };

    render(
      <ReactFlowProvider>
        <CustomNode data={dataWithoutTags} id="node-2" />
      </ReactFlowProvider>
    );

    expect(screen.queryByText("tag1")).not.toBeInTheDocument();
    expect(screen.queryByText("tag2")).not.toBeInTheDocument();
  });
});
