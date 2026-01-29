import { useState, useEffect } from 'react';
import { Card, Statistic, Progress, List, Tag, Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { progressService } from '../../services/progress';
import type { LearningProgress } from '../../types';

const LearningDashboard = () => {
  const [progresses, setProgresses] = useState<LearningProgress[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [progressRes, statsRes] = await Promise.all([
        progressService.getProgress({}),
        progressService.getStats(),
      ]);

      if (progressRes.code === 0 && progressRes.data) {
        setProgresses(progressRes.data);
      }

      if (statsRes.code === 0 && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error: any) {
      console.error('获取学习数据失败:', error);
    } finally {
      setLoading(false);
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

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>学习仪表盘</h1>

      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总知识点"
                value={stats.total || 0}
                suffix="个"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已完成"
                value={stats.completed || 0}
                suffix="个"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="学习中"
                value={stats.in_progress || 0}
                suffix="个"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="平均掌握度"
                value={stats.mastery_avg || 0}
                suffix="%"
                precision={0}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <h2 style={{ marginBottom: '16px' }}>学习进度</h2>
      <Card style={{ marginBottom: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>
        ) : progresses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            还没有开始学习任何知识点，去知识库看看吧！
          </div>
        ) : (
          <List
            dataSource={progresses.map(p => ({
              ...p,
              key: p.id,
            }))}
            renderItem={(item: any) => (
              <List.Item
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                actions={[
                  <Button type="link" onClick={() => navigate(`/knowledge/${item.knowledge_point?.id}`)}>
                    详情
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={item.knowledge_point?.title}
                  description={
                    <div>
                      <div style={{ marginBottom: '8px' }}>
                        <Tag color={getDifficultyColor(item.knowledge_point?.difficulty)}>
                          {item.knowledge_point?.difficulty === 'easy' ? '简单' : item.knowledge_point?.difficulty === 'medium' ? '中等' : '困难'}
                        </Tag>
                      </div>
                      <div>
                        <span style={{ marginRight: '16px' }}>
                          状态：<Tag color={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Tag>
                        </span>
                        <span>
                          掌握度：{item.mastery_level}%
                        </span>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {stats && stats.total > 0 && (
        <Card title="总体进度" style={{ marginBottom: '24px' }}>
          <Progress
            percent={Math.round(((stats.completed || 0) / stats.total) * 100)}
            status="active"
          />
          <div style={{ marginTop: '8px', color: '#666' }}>
            已完成 {stats.completed} / {stats.total} 个知识点
          </div>
        </Card>
      )}
    </div>
  );
};

export default LearningDashboard;
