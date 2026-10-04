import React, { useState, useEffect } from 'react';
import { Header, RoutePath } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { SetupPage } from './pages/SetupPage';
import { ReportPage } from './pages/ReportPage';
import { PricingPage } from './pages/PricingPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { PREBUILT_SAMPLE_REPORT } from './data/sampleChats';
import { RelationshipType, StoredReport } from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<RoutePath>('/');
  const [selectedRelationship, setSelectedRelationship] = useState<RelationshipType>('Situationship 🌀');
  const [activeReport, setActiveReport] = useState<StoredReport>(PREBUILT_SAMPLE_REPORT);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedReportId = params.get('report');
    if (sharedReportId) {
      fetch(`/api/reports/${encodeURIComponent(sharedReportId)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: StoredReport | null) => {
          if (data) {
            setActiveReport(data);
            setCurrentPath('/report');
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleNavigate = (path: RoutePath, reportId?: string) => {
    if (path === '/report' && reportId) {
      if (reportId === PREBUILT_SAMPLE_REPORT.id) {
        setActiveReport(PREBUILT_SAMPLE_REPORT);
      } else {
        fetch(`/api/reports/${encodeURIComponent(reportId)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((data: StoredReport | null) => {
            if (data) setActiveReport(data);
          })
          .catch(() => {});
      }
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportGenerated = (newReport: StoredReport) => {
    setActiveReport(newReport);
    setCurrentPath('/report');
    window.history.replaceState({}, '', `/?report=${newReport.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      <Header currentPath={currentPath} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectRelationshipType={(type) => setSelectedRelationship(type)}
          />
        )}

        {currentPath === '/setup' && (
          <SetupPage
            initialRelationshipType={selectedRelationship}
            onReportGenerated={handleReportGenerated}
          />
        )}

        {currentPath === '/report' && (
          <ReportPage reportData={activeReport} onNavigate={handleNavigate} />
        )}

        {currentPath === '/pricing' && <PricingPage onNavigate={handleNavigate} />}

        {currentPath === '/privacy' && <PrivacyPage onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
