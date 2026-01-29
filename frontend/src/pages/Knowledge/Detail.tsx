import { useState, useEffect } from 'react';
import { Card, Button, Tag, Breadcrumb } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { knowledgeService } from '../../services/knowledge';
import { progressService } from '../../services/progress';
import type { KnowledgePoint } from '../../types';

const KnowledgeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [knowledge, setKnowledge] = useState<KnowledgePoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [progressStatus, setProgressStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');

  useEffect(() => {
    if (id) {
      fetchKnowledge();
    }
  }, [id]);

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const res = await knowledgeService.getById(Number(id));
      if (res.code === 0 && res.data) {
        setKnowledge(res.data);
      }
    } catch (error: any) {
      console.error('获取知识点详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    if (!knowledge) return;

    setUpdating(true);
    try {
      const res = await progressService.updateProgress({
        knowledge_point_id: knowledge.id,
        status: progressStatus,
        mastery_level: 80,
      });
      if (res.code === 0 && res.data) {
        setProgressStatus(res.data.status);
      }
    } catch (error: any) {
      console.error('更新学习进度失败:', error);
    } finally {
      setUpdating(false);
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

  if (loading || !knowledge) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>加载中...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>知识点库</Breadcrumb.Item>
        <Breadcrumb.Item>{knowledge.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <h1 style={{ marginBottom: '16px' }}>{knowledge.title}</h1>

        <div style={{ marginBottom: '16px' }}>
          <Tag color={getDifficultyColor(knowledge.difficulty)}>
            {knowledge.difficulty === 'easy' ? '简单' : knowledge.difficulty === 'medium' ? '中等' : '困难'}
          </Tag>
          <Tag color={knowledge.frequency === 'high' ? 'orange' : knowledge.frequency === 'medium' ? 'cyan' : 'default'}>
            {knowledge.frequency === 'high' ? '高频' : knowledge.frequency === 'medium' ? '中频' : '低频'}
          </Tag>
        </div>

        <p style={{ marginBottom: '24px', color: '#666', lineHeight: '1.6' }}>
          {knowledge.description}
        </p>

        {knowledge.content && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px' }}>内容</h3>
            <div dangerouslySetInnerHTML={{ __html: knowledge.content }} />
          </div>
        )}

        {knowledge.code_example && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px' }}>代码示例</h3>
            <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
              <code>{knowledge.code_example}</code>
            </pre>
          </div>
        )}

        {knowledge.references && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px' }}>参考链接</h3>
            <ul style={{ lineHeight: '1.6' }}>
              {JSON.parse(knowledge.references).map((ref: string, index: number) => (
                <li key={index}>
                  <a href={ref} target="_blank" rel="noopener noreferrer">{ref}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '24px', marginTop: '24px' }}>
          <h3 style={{ marginBottom: '12px' }}>学习进度</h3>
          <Button.Group style={{ marginRight: '16px', marginBottom: '16px' }}>
            <Button
              type={progressStatus === 'not_started' ? 'primary' : 'default'}
              onClick={() => setProgressStatus('not_started')}
            >
              未开始
            </Button>
            <Button
              type={progressStatus === 'in_progress' ? 'primary' : 'default'}
              onClick={() => setProgressStatus('in_progress')}
            >
              学习中
            </Button>
            <Button
              type={progressStatus === 'completed' ? 'primary' : 'default'}
              onClick={() => setProgressStatus('completed')}
            >
              已完成
            </Button>
          </Button.Group>

          <Button type="primary" loading={updating} onClick={handleUpdateProgress}>
            更新进度
          </Button>
        </div>

        <div style={{ marginTop: '24px' }}>
          <Button onClick={() => navigate('/knowledge')}>
            返回列表
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default KnowledgeDetail;
