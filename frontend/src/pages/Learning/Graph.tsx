import { useState, useEffect, useRef } from 'react';
import { Card, Select, Button, Space, Spin, Alert, Tag, Row, Col } from 'antd';
import { ZoomInOutlined, SearchOutlined } from '@ant-design/icons';
import { knowledgeService } from '../../../services/knowledge';
import type { GraphData } from '../../../types';

const KnowledgeGraph = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<any[]>([]);
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

  const onNodeClick = (_: any, node: any) => {
    console.log('Node clicked:', node.data);
    // 可以在这里打开知识点详情
    if (node.data && node.data.id) {
      window.location.href = `/knowledge/${node.data.id}`;
    }
  };

  const getNodeColor = (data: any) => {
    if (data.difficulty === 'easy') return '#52c41a';
    if (data.difficulty === 'medium') return '#1890ff';
    if (data.difficulty === 'hard') return '#f5222d';
    return '#d9d9d9';
  };

  const getEdgeColor = (edge: any) => {
    if (edge.type === 'prerequisite') return '#ff4d4f';
    if (edge.type === 'extended') return '#faad14';
    return '#999';
  };

  return (
    <div style={{ padding: '24px', width: '100%', height: 'calc(100vh - 64px)', position: 'relative' }}>
      {/* 控制面板 */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 4, background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '280px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            <SearchOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            知识图谱
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
              筛选分类
            </span>
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
          </div>

          <div style={{ marginBottom: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
              节点数：{graphData.nodes.length}
            </span>
            <span style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
              关联数：{graphData.edges.length}
            </span>
          </div>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <div style={{ marginBottom: '12px', fontSize: '13px', fontWeight: '500' }}>
              图例
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ width: '12px', height: '12px', background: '#52c41a', borderRadius: '2px', marginRight: '4px' }}></span>
              <span>简单</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ width: '12px', height: '12px', background: '#1890ff', borderRadius: '2px', marginRight: '4px' }}></span>
              <span>中等</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ width: '12px', height: '12px', background: '#f5222d', borderRadius: '2px', marginRight: '4px' }}></span>
              <span>困难</span>
            </div>
            <div style={{ marginTop: '12px', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: '#ff4d4f', borderRadius: '2px', marginRight: '4px' }}></span>
                <span>前置</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: '#faad14', borderRadius: '2px', marginRight: '4px' }}></span>
                <span>扩展</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: '#999', borderRadius: '2px', marginRight: '4px' }}></span>
                <span>相关</span>
              </div>
            </div>
          </div>
        </Space>
      </div>

      {/* 主图谱区域 */}
      <div style={{ marginLeft: '320px', height: 'calc(100vh - 64px)', position: 'relative' }}>
        <Card style={{ height: '100%', boxShadow: 'none', borderRadius: '0' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin size="large" tip="加载图谱中..." />
            </div>
          ) : graphData.nodes.length === 0 ? (
            <Alert
              message="暂无知识图谱数据"
              description="请先在知识库中添加一些知识点，并建立关联关系。"
              type="info"
              showIcon
              style={{ margin: '24px' }}
            />
          ) : (
            <div style={{ height: '100%', position: 'relative' }}>
              {/* 节点列表 */}
              <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 4, background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '300px', maxHeight: 'calc(100% - 48px)', overflow: 'auto' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                    知识点列表
                  </div>
                  {graphData.nodes.map((node: any) => (
                    <Card
                      key={node.id}
                      size="small"
                      style={{ marginBottom: '8px', cursor: 'pointer' }}
                      hoverable
                      onClick={() => window.location.href = `/knowledge/${node.data.id}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                          {node.data.title}
                        </span>
                        <Tag color={getNodeColor(node.data)} style={{ fontSize: '11px', padding: '0 4px' }}>
                          {node.data.difficulty === 'easy' ? '简单' : node.data.difficulty === 'medium' ? '中等' : '困难'}
                        </Tag>
                      </div>
                      <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.4' }}>
                        {node.data.description || '暂无描述'}
                      </div>
                    </Card>
                  ))}
                </Space>
              </div>

              {/* 简化的图谱可视化（使用 flexbox 布局） */}
              <div style={{ padding: '24px', overflow: 'auto', marginLeft: '320px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
                  {graphData.nodes.map((node: any) => (
                    <div 
                      key={node.id}
                      style={{ 
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onClick={() => window.location.href = `/knowledge/${node.data.id}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* 节点圆圈 */}
                      <div 
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: getNodeColor(node.data),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '32px',
                          fontWeight: 'bold',
                          marginBottom: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      >
                        {node.data.title?.charAt(0) || 'K'}
                      </div>

                      {/* 节点信息 */}
                      <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', width: '280px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
                          {node.data.title}
                        </div>
                        <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Tag color={getNodeColor(node.data)} style={{ fontSize: '12px' }}>
                            {node.data.difficulty === 'easy' ? '简单' : node.data.difficulty === 'medium' ? '中等' : '困难'}
                          </Tag>
                          <Tag color={node.data.frequency === 'high' ? 'orange' : node.data.frequency === 'medium' ? 'cyan' : 'default'} style={{ fontSize: '12px' }}>
                            {node.data.frequency === 'high' ? '高频' : node.data.frequency === 'medium' ? '中频' : '低频'}
                          </Tag>
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', textAlign: 'center', lineHeight: '1.5' }}>
                          {node.data.description || '暂无描述'}
                        </div>
                      </div>

                      {/* 关联线（简单可视化） */}
                      {graphData.edges.filter((edge: any) => edge.source === node.id).map((edge: any, index) => (
                        <div 
                          key={edge.id}
                          style={{ 
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '2px',
                            height: '60px',
                            background: getEdgeColor(edge),
                            transform: index === 0 ? 'translateX(50%)' : 'translateX(50%)',
                            zIndex: -1,
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <Alert
                  message="图谱说明"
                  description="点击知识点圆圈可以跳转到详情。圆圈颜色表示难度（绿色=简单、蓝色=中等、红色=困难）。"
                  type="info"
                  showIcon
                  style={{ marginTop: '32px' }}
                  icon={<ZoomInOutlined />}
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
