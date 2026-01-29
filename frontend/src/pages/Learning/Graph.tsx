import { useState, useEffect, useRef } from 'react';
import { Card, Button, Select, Spin, Alert } from 'antd';
import ReactFlow, { Node, Edge, Background, Controls, BackgroundVariant, Panel } from 'reactflow';
import 'reactflow/dist/style.css';
import { knowledgeService } from '../../services/knowledge';
import type { GraphData } from '../../types';

const KnowledgeGraph = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  useEffect(() => {
    fetchGraph();
    fetchCategories();
  }, [selectedCategory]);

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const res = await knowledgeService.getGraph(selectedCategory);
      if (res.code === 0 && res.data) {
        setGraphData(res.data);
      }
    } catch (error: any) {
      console.error('获取知识图谱失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await knowledgeService.getCategories();
      if (res.code === 0 && res.data) {
        setCategories(res.data);
      }
    } catch (error: any) {
      console.error('获取分类失败:', error);
    }
  };

  const onConnect = (params: any) => console.log('onConnect', params);
  const onInit = (reactFlowInstance: any) => setReactFlowInstance(reactFlowInstance);

  const getNodeColor = (data: any) => {
    if (data.difficulty === 'easy') return '#52c41a';
    if (data.difficulty === 'medium') return '#1890ff';
    if (data.difficulty === 'hard') return '#f5222d';
    return '#d9d9d9';
  };

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 64px)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 4 }}>
        <Card size="small" style={{ width: '200px', marginBottom: '16px' }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>筛选分类</div>
          <Select
            style={{ width: '100%' }}
            placeholder="选择分类"
            allowClear
            onChange={(value) => setSelectedCategory(value)}
          >
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Card>

        <Card size="small" style={{ width: '200px' }}>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>图例</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ width: '12px', height: '12px', background: '#52c41a', borderRadius: '2px', marginRight: '8px' }}></span>
            <span>简单</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ width: '12px', height: '12px', background: '#1890ff', borderRadius: '2px', marginRight: '8px' }}></span>
            <span>中等</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '12px', height: '12px', background: '#f5222d', borderRadius: '2px', marginRight: '8px' }}></span>
            <span>困难</span>
          </div>
        </Card>
      </div>

      <ReactFlowProvider>
        <ReactFlow
          nodes={graphData.nodes.map((node) => ({
            ...node,
            data: { ...node.data, label: node.label },
            style: {
              background: getNodeColor(node.data),
              color: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '8px 12px',
              fontSize: '14px',
              fontWeight: 'bold',
              width: 'auto',
              minWidth: '100px',
            },
          }))}
          edges={graphData.edges.map((edge) => ({
            ...edge,
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: edge.type === 'prerequisite' ? '#ff4d4f' : edge.type === 'extended' ? '#faad14' : '#999',
              strokeWidth: 2,
            },
            label: edge.label,
            labelStyle: {
              fontSize: '12px',
              fontWeight: 500,
              fill: '#666',
            },
          }))}
          onConnect={onConnect}
          onInit={onInit}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <Background color="#f0f2f5" gap={16} />
          <Panel position="top-right">
            <Spin spinning={loading}>
              <div style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>
                知识图谱
              </div>
              <div style={{ padding: '12px' }}>
                节点数：{graphData.nodes.length}
              </div>
              <div style={{ padding: '12px' }}>
                关联数：{graphData.edges.length}
              </div>
            </Spin>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default KnowledgeGraph;
