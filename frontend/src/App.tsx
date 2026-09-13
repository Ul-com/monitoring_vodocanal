import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import ObjectsPage from './pages/ObjectsPage';
import AlertsPage from './pages/AlertsPage';
import ConstructorPage from './pages/ConstructorPage';
import UsersPage from './pages/UsersPage';
import StatisticsPage from './pages/StatisticsPage';
import LoginPage from './pages/LoginPage';
import { useStore } from './store';
import './styles/global.css';

const { Content } = Layout;

const antdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#003366',
    colorLink: '#0A4C8A',
    colorSuccess: '#16A34A',
    colorWarning: '#F59E0B',
    colorError: '#DC2626',
    colorTextBase: '#0F172A',
    colorBorder: '#E2E8F0',
    colorBgLayout: '#F1F4F8',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    borderRadius: 10,
    controlHeight: 38,
    wireframe: false,
  },
  components: {
    Layout: {
      headerBg: 'transparent',
      headerHeight: 64,
      headerPadding: 0,
      siderBg: '#FFFFFF',
      bodyBg: '#F1F4F8',
    },
    Menu: {
      itemHeight: 42,
      itemMarginInline: 8,
      itemColor: '#334155',
      itemHoverColor: '#003366',
      itemHoverBg: '#F1F5F9',
      itemSelectedColor: '#003366',
      itemSelectedBg: '#E6F0FA',
    },
    Card: {
      headerFontSize: 15,
      headerBg: 'transparent',
      boxShadowTertiary: '0 1px 2px rgba(15, 23, 42, 0.06)',
    },
    Table: {
      headerBg: '#F8FAFC',
      headerColor: '#475569',
      headerSplitColor: 'transparent',
      rowHoverBg: '#F8FAFC',
      cellPaddingBlock: 14,
    },
    Tag: {
      defaultBg: '#F1F5F9',
    },
  },
};

const App: React.FC = () => {
  const { currentUser } = useStore();

  return (
    <ConfigProvider theme={antdTheme} locale={ruRU}>
      <BrowserRouter>
        {currentUser ? (
          <Layout style={{ minHeight: '100vh' }}>
            <Header />
            <Layout>
              <Sidebar />
              <Content style={{ overflow: 'auto' }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/objects" element={<ObjectsPage />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/constructor" element={<ConstructorPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/statistics" element={<StatisticsPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
