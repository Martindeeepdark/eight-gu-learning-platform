import { useState, useEffect } from 'react';
import { Card, Tag, Button, Pagination, Input, Select, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { knowledgeService } from '../services/knowledge';
import type { KnowledgePoint } from '../types';

const KnowledgeList = () => {
  const [knowledge, setKnowledge] = useState<KnowledgePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState({ category_id: undefined, difficulty: '', frequency: '', search: '' });
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

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

  const handleCategoryChange = (value: any) => {
    setFilters({ ...filters, category_id: value });
  };

  const handleDifficultyChange = (value: any) => {
    setFilters({ ...filters, difficulty: value || '' });
  };

  const handleFrequencyChange = (value: any) => {
    setFilters({ ...filters, frequency: value || '' });
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: 'bold' }}>知识点库</h1>

      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space direction="horizontal" size="middle" wrap>
            <Select
              placeholder="选择分类"
              allowClear
              style={{ width: 200 }}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="难度"
              allowClear
              style={{ width: 120 }}
              onChange={handleDifficultyChange}
            >
              <Select.Option value="easy">简单</Select.Option>
              <Select.Option value="medium">中等</Select.Option>
              <Select.Option value="hard">困难</Select.Option>
            </Select>
            <Select
              placeholder="频率"
              allowClear
              style={{ width: 120 }}
              onChange={handleFrequencyChange}
            >
              <Select.Option value="high">高频</Select.Option>
              <Select.Option value="medium">中频</Select.Option>
              <Select.Option value="low">低频</Select.Option>
            </Select>
            <Input.Search
              placeholder="搜索知识点"
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
              enterButton
            />
          </Space>
        </Space>
      </Card>

      {loading ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>
        </Card>
      ) : knowledge.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            暂无知识点
          </div>
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {knowledge.map((item) => (
              <Col span={8} key={item.id} style={{ marginBottom: '16px' }}>
                <Card
                  hoverable
                  title={
                    <Space>
                      <span>{item.title}</span>
                      <Space size="small">
                        <Tag color={item.difficulty === 'easy' ? 'green' : item.difficulty === 'medium' ? 'blue' : 'red'}>
                          {item.difficulty === 'easy' ? '简单' : item.difficulty === 'medium' ? '中等' : '困难'}
                        </Tag>
                        <Tag color={item.frequency === 'high' ? 'orange' : item.frequency === 'medium' ? 'cyan' : 'default'}>
                          {item.frequency === 'high' ? '高频' : item.frequency === 'medium' ? '中频' : '低频'}
                        </Tag>
                      </Space>
                    </Space>
                  }
                  extra={
                    <Button type="link" onClick={() => navigate(`/knowledge/${item.id}`)}>
                      详情
                    </Button>
                  }
                >
                  <p style={{ color: '#666', marginBottom: '12px' }}>{item.description}</p>
                  {item.code_example && (
                    <pre style={{ 
                      background: '#f5f5f5', 
                      padding: '12px', 
                      borderRadius: '4px',
                      overflow: 'auto',
                      maxHeight: '100px',
                      fontSize: '12px',
                      marginBottom: '12px',
                    }}>
                      <code>{item.code_example}</code>
                    </pre>
                  )}
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
              showSizeChanger
              showQuickJumper
            />
          )}
        </>
      )}
    </div>
  );
};

export default KnowledgeList;
