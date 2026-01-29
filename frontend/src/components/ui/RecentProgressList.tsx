import { useEffect, useState } from 'react';
import { List, Card, Tag, Avatar, Rate } from 'antd';
import { ClockCircleOutlined, EyeOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { progressService } from '../../../services/progress';
import type { LearningProgress } from '../../../types';

interface RecentProgressListProps {
  limit?: number;
}

const RecentProgressList = ({ limit = 5 }: RecentProgressListProps) => {
  const [progresses, setProgresses] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentProgress();
  }, []);

  const fetchRecentProgress = async () => {
    setLoading(true);
    try {
      const res = await progressService.getProgress({});
      if (res.code === 0 && res.data) {
        // 取最近的学习记录
        const sorted = [...res.data].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setProgresses(sorted.slice(0, limit));
      }
    } catch (error: any) {
      console.error('获取最近学习失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'in_progress':
        return <Tag color="processing">学习中</Tag>;
      default:
        return <Tag color="default">未开始</Tag>;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <ThunderboltOutlined style={{ color: '#52c41a' }} />;
      case 'medium':
        return <ThunderboltOutlined style={{ color: '#1890ff' }} />;
      case 'hard':
        return <ThunderboltOutlined style={{ color: '#f5222d' }} />;
      default:
        return null;
    }
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
    return date.toLocaleDateString();
  };

  return (
    <Card title="最近学习" loading={loading}>
      {progresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          还没有学习记录
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={progresses}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar 
                    style={{ backgroundColor: item.status === 'completed' ? '#52c41a' : '#f0f2f5' }}
                    icon={<ClockCircleOutlined />}
                  />
                }
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{item.knowledge_point?.title}</span>
                    {getDifficultyIcon(item.knowledge_point?.difficulty)}
                    {getStatusTag(item.status)}
                  </div>
                }
                description={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>
                      {formatTime(item.updated_at)}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        <EyeOutlined style={{ marginRight: '4px' }} />
                        {item.mastery_level}% 掌握度
                      </span>
                      <Rate 
                        disabled 
                        defaultValue={Math.ceil(item.mastery_level / 20)} 
                        style={{ fontSize: '12px' }}
                      />
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default RecentProgressList;
