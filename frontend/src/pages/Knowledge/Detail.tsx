import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tag, Button, Breadcrumb, message, Spin } from 'antd';
import { BookOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { knowledgeService } from '../../../services/knowledge';
import { progressService } from '../../../services/progress';
import type { KnowledgePoint } from '../../../types';

const KnowledgeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [knowledge, setKnowledge] = useState<KnowledgePoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [progressStatus, setProgressStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      fetchKnowledge();
      fetchProgress();
    }
  }, [id]);

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const res = await knowledgeService.getById(Number(id));
      if (res.code === 0 && res.data) {
        setKnowledge(res.data);
      } else {
        message.error(res.message || '获取知识点详情失败');
      }
    } catch (error: any) {
      message.error('获取知识点详情失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await progressService.getProgress({ knowledge_id: Number(id) });
      if (res.code === 0 && res.data && res.data.length > 0) {
        setProgressStatus(res.data[0].status);
        setProgressLoaded(true);
      }
    } catch (error: any) {
      console.error('获取学习进度失败:', error);
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
        message.success('学习进度更新成功');
      } else {
        message.error(res.message || '更新学习进度失败');
      }
    } catch (error: any) {
      message.error('更新学习进度失败');
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

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'high':
        return 'orange';
      case 'medium':
        return 'cyan';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'high':
        return '高频';
      case 'medium':
        return '中频';
      case 'low':
        return '低频';
      default:
        return frequency;
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

  if (loading || !knowledge) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>知识点库</Breadcrumb.Item>
        <Breadcrumb.Item>{knowledge.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <h1 style={{ marginBottom: '16px', fontSize: '28px', fontWeight: 'bold' }}>
          {knowledge.title}
        </h1>

        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <Tag color={getDifficultyColor(knowledge.difficulty)} icon={<BookOutlined />}>
            难度：{getDifficultyText(knowledge.difficulty)}
          </Tag>
          <Tag color={getFrequencyColor(knowledge.frequency)} icon={<ClockCircleOutlined />}>
            频率：{getFrequencyText(knowledge.frequency)}
          </Tag>
          {progressLoaded && (
            <Tag color={getStatusColor(progressStatus)}>
              {getStatusText(progressStatus)}
            </Tag>
          )}
        </div>

        <p style={{ marginBottom: '24px', color: '#666', lineHeight: '1.6', fontSize: '16px' }}>
          {knowledge.description}
        </p>

        {knowledge.content && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' }}>
              📖 内容
            </h2>
            <div 
              style={{ 
                background: '#fafafa', 
                padding: '20px', 
                borderRadius: '8px',
                lineHeight: '1.8',
                fontSize: '15px',
              }} 
              dangerouslySetInnerHTML={{ __html: knowledge.content }} 
            />
          </div>
        )}

        {knowledge.code_example && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' }}>
              💻 代码示例
            </h2>
            <pre 
              style={{ 
                background: '#282c34', 
                color: '#abb2bf', 
                padding: '16px', 
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '13px',
                lineHeight: '1.6',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              }}
            >
              <code>{knowledge.code_example}</code>
            </pre>
          </div>
        )}

        {knowledge.references && JSON.parse(knowledge.references).length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' }}>
              🔗 参考链接
            </h2>
            <ul style={{ lineHeight: '2', fontSize: '15px', paddingLeft: '20px' }}>
              {JSON.parse(knowledge.references).map((ref: string, index: number) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <a 
                    href={ref} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#1890ff', textDecoration: 'none' }}
                  >
                    {ref}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '32px', marginTop: '32px' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold' }}>
            📈 学习进度
          </h2>
          
          <div style={{ marginBottom: '20px' }}>
            <span style={{ marginRight: '16px', fontWeight: '500' }}>当前状态：</span>
            <span 
              style={{ 
                padding: '4px 12px', 
                borderRadius: '4px', 
                background: '#f0f0f0',
                fontWeight: '500',
              }}
            >
              {getStatusText(progressStatus)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button 
              type={progressStatus === 'not_started' ? 'primary' : 'default'}
              size="large"
              onClick={() => setProgressStatus('not_started')}
              style={{ minWidth: '120px' }}
            >
              未开始
            </Button>
            <Button 
              type={progressStatus === 'in_progress' ? 'primary' : 'default'}
              size="large"
              onClick={() => setProgressStatus('in_progress')}
              style={{ minWidth: '120px' }}
            >
              学习中
            </Button>
            <Button 
              type={progressStatus === 'completed' ? 'primary' : 'default'}
              size="large"
              onClick={() => setProgressStatus('completed')}
              style={{ minWidth: '120px' }}
            >
              已完成
            </Button>
            <Button 
              type="primary"
              size="large"
              onClick={handleUpdateProgress}
              loading={updating}
              style={{ minWidth: '120px', background: '#52c41a', borderColor: '#52c41a' }}
            >
              更新进度
            </Button>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Button onClick={() => navigate('/knowledge')} size="large">
              返回列表
            </Button>
            <Button 
              type="primary" 
              onClick={() => navigate(`/exercises?knowledge_id=${knowledge.id}`)} 
              size="large"
            >
              去练习
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KnowledgeDetail;
