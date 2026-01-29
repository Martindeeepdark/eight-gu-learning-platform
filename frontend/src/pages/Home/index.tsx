import { useEffect, useState } from 'react';
import { Card, Statistic, Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { knowledgeService } from '../../services/knowledge';
import type { KnowledgePoint } from '../../types';

const Home = () => {
  const [knowledge, setKnowledge] = useState<KnowledgePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const res = await knowledgeService.getList({ page: 1, page_size: 6 });
      if (res.code === 0 && res.data) {
        setKnowledge(res.data.items);
      }
    } catch (error: any) {
      console.error('获取知识点失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic title="总知识点数" value={100} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已学习" value={30} suffix="个" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="掌握度" value={65} suffix="%" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="练习题数" value={300} suffix="道" />
          </Card>
        </Col>
      </Row>

      <h2 style={{ marginBottom: '16px' }}>推荐学习</h2>
      <Row gutter={[16, 16]}>
        {knowledge.map((item) => (
          <Col span={8} key={item.id} style={{ marginBottom: '16px' }}>
            <Card
              title={item.title}
              extra={
                <Button type="link" onClick={() => navigate(`/knowledge/${item.id}`)}>
                  详情
                </Button>
              }
              hoverable
            >
              <p style={{ color: '#666', marginBottom: '8px' }}>{item.description}</p>
              <div>
                <span style={{ marginRight: '16px' }}>
                  难度：{item.difficulty === 'easy' ? '简单' : item.difficulty === 'medium' ? '中等' : '困难'}
                </span>
                <span>
                  频率：{item.frequency === 'high' ? '高频' : item.frequency === 'medium' ? '中频' : '低频'}
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Button type="primary" size="large" onClick={() => navigate('/knowledge')}>
          查看全部知识点
        </Button>
      </div>
    </div>
  );
};

export default Home;
