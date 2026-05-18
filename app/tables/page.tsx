"use client";

import { useApp } from "@/context/AppContext";
import ExpandableTable from "@/components/tables/ExpandableTable";
import ColumnPickerTable from "@/components/tables/ColumnPickerTable";
import StandardTable from "@/components/tables/StandardTable";
import styles from "@/styles/tables/shared.module.scss";

export default function TablesPage() {
  const { language } = useApp();
  const tr = language === "tr";

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{tr ? "Tablolar" : "Tables"}</h1>
        <p className={styles.pageDesc}>
          {tr
            ? "Üç tablo tasarımı tek sayfada. Son sütunda işlemler menüsü bulunur."
            : "Three table designs on one page. Each includes an actions menu in the last column."}
        </p>
      </header>

      <div className={styles.pageStack}>
        <section id="expandable">
          <ExpandableTable />
        </section>
        <section id="data-grid">
          <ColumnPickerTable />
        </section>
        <section id="standard">
          <StandardTable />
        </section>
      </div>
    </div>
  );
}
