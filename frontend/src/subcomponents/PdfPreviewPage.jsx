// src/subcomponents/PdfPreviewPage.jsx
import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
  },
  titleWrapper: {
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 1.4,
    marginBottom: 6,
    textAlign: "justify",
  },
  footer: {
    position: "absolute",
    fontSize: 10,
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#999999",
  },
  end: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
});

// Document that shows title once, then lets text flow across pages
const MyDocument = ({ title, content }) => {
  // Split into paragraphs for nicer wrapping, but NO manual page chunking
  const paragraphs = (content || "").split(/\n+/).filter(Boolean);

  return (
    <Document>
      {/* First page: title + content */}
      <Page style={styles.page}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {paragraphs.map((paragraph, idx) => (
          <Text key={idx} style={styles.content}>
            {paragraph}
          </Text>
        ))}
        <Text style={styles.end}>*** The End ***</Text>

        <Text style={styles.footer}>
          © 2025 MiracleGPT by Senindu Dinapura. All rights reserved.
        </Text>
      </Page>
    </Document>
  );
};

const PdfPreviewPage = () => {
  const [title, setTitle] = useState("No Title");
  const [content, setContent] = useState("No Content");

  useEffect(() => {
    const savedTitle = localStorage.getItem("pdfTitle") || "No Title";
    const savedContent = localStorage.getItem("pdfContent") || "No Content";
    setTitle(savedTitle);
    setContent(savedContent);
  }, []);

  const doc = <MyDocument title={title} content={content} />;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar with title + download link */}
      <div
        style={{
          padding: "8px",
          textAlign: "center",
          backgroundColor: "#f3f3f3",
          borderBottom: "1px solid #ddd",
          flexShrink: 0,
        }}
      >
        <div style={{ marginBottom: 4, fontWeight: "bold" }}>
          {title || "Story Preview"}
        </div>
        <PDFDownloadLink document={doc} fileName={`${title || "story"}.pdf`}>
          {({ loading }) =>
            loading ? "Preparing PDF..." : "Download / Open in external app"
          }
        </PDFDownloadLink>
      </div>

      {/* PDF viewer area */}
      <div
        style={{
          flexGrow: 1,
          minHeight: 0, // helps flexbox + viewport on mobile
        }}
      >
        <PDFViewer
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          showToolbar={true}
        >
          {doc}
        </PDFViewer>
      </div>
    </div>
  );
};

export default PdfPreviewPage;
