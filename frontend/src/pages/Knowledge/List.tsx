import { useState, useEffect } from 'react';
import { Card, Button, Select, Input, Pagination, Tag, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { knowledgeService } from '../../services/knowledge';
import type { KnowledgePoint } from '../../types';

const KnowledgeList = () => {
  const [knowledge, setKnowledge] = useState<KnowledgePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState({ category_id: undefined, difficulty: '', frequency: '', search: '' });
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchKnowledge();
    fetchCategories();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const res = await knowledgeService.getList({
        page: pagination.current,
        page_size: pagination.pageSize,
        ...filters,
      });
      if (res.code === 0 && res.data) {
        setKnowledge(res.data.items);
        setPagination({ ...pagination, total: res.data.total });
      }
    } catch (error: any) {
      console.error('获取知识点失败:', error);
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

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ ...pagination, current: page, pageSize });
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

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>知识点库</h1>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Select
              placeholder="选择分类"
              allowClear
              onChange={(value) => setFilters({ ...filters, category_id: value })}
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="难度"
              allowClear
              onChange={(value) => setFilters({ ...filters, difficulty: value || '' })}
            >
              <Select.Option value="easy">简单</Select.Option>
              <Select.Option value="medium">中等</Select.Option>
              <Select.Option value="hard">困难</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="频率"
              allowClear
              onChange={(value) => setFilters({ ...filters, frequency: value || '' })}
            >
              <Select.Option value="high">高频</Select.Option>
              <Select.Option value="medium">中频</Select.Option>
              <Select.Option value="low">低频</Select.Option>
            </Select>
          </Col>
          <Col span={6}>
            <Input.Search
              placeholder="搜索知识点"
              onSearch={handleSearch}
              enterButton
            />
          </Col>
        </Row>
      </Card>

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
              <p style={{ color: '#666', marginBottom: '12px' }}>{item.description}</p>
              <div style={{ marginBottom: '12px' }}>
                <Tag color={getDifficultyColor(item.difficulty)}>
                  {item.difficulty === 'easy' ? '简单' : item.difficulty === 'medium' ? '中等' : '困难'}
                </Tag>
                <Tag color={getFrequencyColor(item.frequency)}>
                  {item.frequency === 'high' ? '高频' : item.frequency === 'medium' ? '中频' : '低频'}
                </Tag>
              </div>
              <Button type="primary" onClick={() => navigate(`/knowledge/${item.id}`)}>
                开始学习
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {knowledge.length > 0 && (
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          style={{ marginTop: '24px', textAlign: 'center' }}
        />
      )}
    </div>
  );
};

export default KnowledgeList;
