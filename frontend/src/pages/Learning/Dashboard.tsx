import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, List, Tag, Progress, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BookOutlined, RiseOutlined, CheckCircleOutlined, TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { progressService } from '../../../services/progress';
import type { LearningProgress } from '../../../types';
import ProgressChart from '../../../components/ui/ProgressChart';

const LearningDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [progresses, setProgresses] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, progressRes] = await Promise.all([
        progressService.getStats(),
        progressService.getProgress({}),
      ]);

      if (statsRes.code === 0 && statsRes.data) {
        setStats(statsRes.data);
      }

      if (progressRes.code === 0 && progressRes.data) {
        // 按更新时间排序
        const sorted = [...progressRes.data].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setProgresses(sorted);
      }
    } catch (error: any) {
      message.error('获取学习数据失败');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'blue';
      case 'hard':
        return 'red';
      default:
        return 'default';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return difficulty;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'processing';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in_progress':
        return '学习中';
      default:
        return '未开始';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: 'bold' }}>
        学习仪表盘
      </h1>

      {stats && <ProgressChart />}

      <Row gutter={[16, 16]} style={{ marginTop: '32px' }}>
        <Col span={16}>
          <Card title="最近学习" loading={loading}>
            {progresses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                还没有开始学习任何知识点，去知识库看看吧！
                <div style={{ marginTop: '16px' }}>
                  <Button type="primary" onClick={() => navigate('/knowledge')}>
                    去知识库
                  </Button>
                </div>
              </div>
            ) : (
              <List
                dataSource={progresses}
                renderItem={(item: any) => (
                  <List.Item
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                    onClick={() => navigate(`/knowledge/${item.knowledge_point.id}`)}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: getStatusColor(item.status) === 'success' ? '#52c41a' : getStatusColor(item.status) === 'processing' ? '#1890ff' : '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: getStatusColor(item.status) === 'success' ? '#fff' : '#999',
                          fontSize: '16px',
                        }}>
                          {getStatusText(item.status) === '已完成' ? '✓' : getStatusText(item.status) === '学习中' ? '▶' : '○'}
                        </div>
                      }
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '500' }}>
                            {item.knowledge_point.title}
                          </span>
                          <Tag color={getDifficultyColor(item.knowledge_point.difficulty)}>
                            {getDifficultyText(item.knowledge_point.difficulty)}
                          </Tag>
                        </div>
                      }
                      description={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ClockCircleOutlined style={{ color: '#999', fontSize: '12px' }} />
                            <span style={{ color: '#666', fontSize: '13px' }}>
                              {new Date(item.updated_at).toLocaleString()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: '#666' }}>
                              掌握度：
                            </span>
                            <Progress 
                              percent={item.mastery_level} 
                              size="small" 
                              strokeColor={item.mastery_level >= 80 ? '#52c41a' : item.mastery_level >= 50 ? '#1890ff' : '#faad14'}
                              style={{ width: '100px' }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Tag color={getStatusColor(item.status)}>
                              {getStatusText(item.status)}
                            </Tag>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Col>
        <Col span={8}>
          <Card title="快速操作" style={{ position: 'sticky', top: '24px' }}>
            <Button 
              type="primary" 
              icon={<BookOutlined />}
              size="large"
              block
              onClick={() => navigate('/knowledge')}
              style={{ marginBottom: '16px', height: '48px', fontSize: '16px' }}
            >
              浏览知识库
            </Button>
            <Button 
              icon={<RiseOutlined />}
              size="large"
              block
              onClick={() => navigate('/exercises')}
              style={{ marginBottom: '16px', height: '48px', fontSize: '16px' }}
            >
              开始练习
            </Button>
            <Button 
              icon={<TrophyOutlined />}
              size="large"
              block
              onClick={() => navigate('/exercises/wrong')}
              style={{ marginBottom: '16px', height: '48px', fontSize: '16px' }}
            >
              查看错题本
            </Button>
            <Button 
              icon={<CheckCircleOutlined />}
              size="large"
              block
              onClick={() => navigate('/learning/graph')}
              style={{ height: '48px', fontSize: '16px' }}
            >
              查看知识图谱
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LearningDashboard;
