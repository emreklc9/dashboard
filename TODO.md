şimdi önceliğimiz bir sidebar ve topbar olmalı


topbarda yöneteceğimiz 

3 farklı renk seçeneği kırmızı (c41e3a) yeşil (2e8b57) ve mavi (005eb8) olacak 
dark modu olacak
2 tane dil seçeneğimiz tr ve en 
kullanıcı profil alanı


sidebarda 
/dashboard /tables /kanban /chat /mail /tags /settings
sayfaları olacak 

renk kod örneği

// ========================================
// COLOR SYSTEM
// ========================================

// BRAND COLORS
$accent-red: #c41e3a;
$accent-green: #2e8b57;
$accent-blue: #005eb8;

// ========================================
// RED SCALE
// ========================================

$red-100: #ffe5ea;
$red-200: #f8b8c2;
$red-300: #ef7f92;
$red-400: #dd4b66;
$red-500: #c41e3a;
$red-600: #a31831;
$red-700: #7f1327;
$red-800: #5f0e1d;

// ========================================
// GREEN SCALE
// ========================================

$green-100: #e6f6ee;
$green-200: #bce5cf;
$green-300: #86d1aa;
$green-400: #53b983;
$green-500: #2e8b57;
$green-600: #246f46;
$green-700: #1b5535;
$green-800: #123c25;

// ========================================
// BLUE SCALE
// ========================================

$blue-100: #e5f1ff;
$blue-200: #b8d8ff;
$blue-300: #7fb7ff;
$blue-400: #3d8cff;
$blue-500: #005eb8;
$blue-600: #004b94;
$blue-700: #00396f;
$blue-800: #00284d;

// ========================================
// NEUTRAL SCALE
// ========================================

$gray-50: #f8fafc;
$gray-100: #f1f5f9;
$gray-200: #e2e8f0;
$gray-300: #cbd5e1;
$gray-400: #94a3b8;
$gray-500: #64748b;
$gray-600: #475569;
$gray-700: #334155;
$gray-800: #1e293b;
$gray-900: #0f172a;

// ========================================
// LIGHT THEME
// ========================================

:root {
  // Backgrounds
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f1f5f9;

  // Text
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;

  // Borders
  --border-color: #e2e8f0;

  // Brand
  --primary: #005eb8;
  --primary-hover: #004b94;

  // Status
  --success: #2e8b57;
  --danger: #c41e3a;
  --info: #005eb8;

  // Status backgrounds
  --success-bg: #e6f6ee;
  --danger-bg: #ffe5ea;
  --info-bg: #e5f1ff;

  // Card
  --card-bg: #ffffff;
  --card-hover: #f8fafc;

  // Sidebar
  --sidebar-bg: #ffffff;
  --sidebar-text: #334155;
  --sidebar-active: #005eb8;

  // Topbar
  --topbar-bg: rgba(255, 255, 255, 0.9);

  // Shadows
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
  --shadow-md: 0 4px 6px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 10px 15px rgba(15, 23, 42, 0.12);

  // Radius
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;

  // Transition
  --transition: all 0.25s ease;
}

// ========================================
// DARK THEME
// ========================================

[data-theme='dark'] {
  // Backgrounds
  --bg-primary: #0f172a;
  --bg-secondary: #111827;
  --bg-tertiary: #1e293b;

  // Text
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;

  // Borders
  --border-color: #334155;

  // Brand
  --primary: #3d8cff;
  --primary-hover: #7fb7ff;

  // Status
  --success: #53b983;
  --danger: #dd4b66;
  --info: #3d8cff;

  // Status backgrounds
  --success-bg: rgba(46, 139, 87, 0.15);
  --danger-bg: rgba(196, 30, 58, 0.15);
  --info-bg: rgba(0, 94, 184, 0.15);

  // Card
  --card-bg: #111827;
  --card-hover: #1e293b;

  // Sidebar
  --sidebar-bg: #111827;
  --sidebar-text: #e2e8f0;
  --sidebar-active: #3d8cff;

  // Topbar
  --topbar-bg: rgba(17, 24, 39, 0.8);

  // Shadows
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.25);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.45);
}

// ========================================
// GLOBAL STYLES
// ========================================

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: var(--transition);
  font-family: Inter, sans-serif;
}

// ========================================
// CARD
// ========================================

.card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: var(--transition);

  &:hover {
    background: var(--card-hover);
  }
}

// ========================================
// BUTTONS
// ========================================

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 18px;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background: var(--primary-hover);
  }
}

.btn-success {
  background: var(--success);
}

.btn-danger {
  background: var(--danger);
}

// ========================================
// SIDEBAR
// ========================================

.sidebar {
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  border-right: 1px solid var(--border-color);

  .active {
    background: var(--info-bg);
    color: var(--sidebar-active);
  }
}

// ========================================
// TOPBAR
// ========================================

.topbar {
  background: var(--topbar-bg);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
}

// ========================================
// THEME TOGGLE JS
// ========================================

// document.documentElement.setAttribute('data-theme', 'dark');
// document.documentElement.setAttribute('data-theme', 'light');







ApexCharts kullanarak veya Recharts kullanarak dashboardda önce rasgele data oluşturmanı ve tablo pie chart line chart bir(4 lü) istatistikcartı ufak bir bilgilendirme alanı olan bir yapı oluşturabilir miyiz?