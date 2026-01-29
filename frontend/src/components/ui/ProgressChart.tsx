import { useEffect, useRef, useState } from 'react';
import { Card, Progress, Statistic, Row, Col } from 'antd';
import { TrophyOutlined, RiseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { progressService } from '../../services/progress';

const ProgressChart = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await progressService.getStats();
      if (res.code === 0 && res.data) {
        setStats(res.data);
      }
    } catch (error: any) {
      console.error('获取学习统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercent = () => {
    if (!stats) return 0;
    return Math.round(((stats.completed || 0) / (stats.total || 1)) * 100);
  };

  return (
    <Card title="学习统计" loading={loading}>
      {stats && (
        <div style={{ padding: '16px' }}>
          <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="总知识点"
                  value={stats.total || 0}
                  suffix="个"
                  prefix={<BookOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="已完成"
                  value={stats.completed || 0}
                  suffix="个"
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="学习中"
                  value={stats.in_progress || 0}
                  suffix="个"
                  prefix={<RiseOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="未开始"
                  value={stats.not_started || 0}
                  suffix="个"
                  prefix={<TrophyOutlined style={{ color: '#999' }} />}
                  valueStyle={{ color: '#999' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="平均掌握度"
                  value={stats.mastery_avg || 0}
                  suffix="%"
                  precision={0}
                  prefix={<CheckCircleOutlined style={{ color: '#f5222d' }} />}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="完成率"
                  value={getProgressPercent()}
                  suffix="%"
                  precision={0}
                  prefix={<TrophyOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="总体进度" style={{ marginTop: '24px' }}>
            <Progress
              percent={getProgressPercent()}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <div style={{ marginTop: '16px', textAlign: 'center', color: '#666' }}>
              已完成 {stats.completed || 0} / {stats.total || 0} 个知识点
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default ProgressChart;
