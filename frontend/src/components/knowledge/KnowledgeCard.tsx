import { Card, Tag, Space, Button } from 'antd';
import { ClockCircleOutlined, FireOutlined, BookOutlined } from '@ant-design/icons';
import type { KnowledgePoint } from '../../types';

interface KnowledgeCardProps {
  knowledge: KnowledgePoint;
  onStart?: () => void;
  onDetail?: () => void;
}

const KnowledgeCard = ({ knowledge, onStart, onDetail }: KnowledgeCardProps) => {
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

  return (
    <Card
      hoverable
      style={{ marginBottom: '16px' }}
      title={
        <Space>
          <span>{knowledge.title}</span>
          <Tag color={getFrequencyColor(knowledge.frequency)}>
            {getFrequencyText(knowledge.frequency)}
          </Tag>
        </Space>
      }
      extra={
        <Button type="link" size="small" onClick={onDetail}>
          详情
        </Button>
      }
    >
      <div style={{ marginBottom: '12px', color: '#666' }}>
        {knowledge.description || '暂无描述'}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <Space>
          <div>
            <ClockCircleOutlined style={{ marginRight: '4px', color: getDifficultyColor(knowledge.difficulty) }} />
            <span style={{ color: getDifficultyColor(knowledge.difficulty), fontWeight: 500 }}>
              {getDifficultyText(knowledge.difficulty)}
            </span>
          </div>
          <div>
            <BookOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
            <span>{knowledge.category?.name || '未分类'}</span>
          </div>
        </Space>
      </div>

      {knowledge.code_example && (
        <div style={{ marginBottom: '12px' }}>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '100px',
            fontSize: '12px',
          }}>
            <code>{knowledge.code_example}</code>
          </pre>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          {knowledge.difficulty && (
            <Tag color={getDifficultyColor(knowledge.difficulty)}>
              <FireOutlined style={{ marginRight: '4px' }} />
              {getDifficultyText(knowledge.difficulty)}
            </Tag>
          )}
        </Space>
        <Button type="primary" size="small" onClick={onStart}>
          开始学习
        </Button>
      </div>
    </Card>
  );
};

export default KnowledgeCard;
