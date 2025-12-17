// src/subcomponents/PdfPreviewPage.jsx
import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    textAlign: "justify",
  },
  header: {
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
    whiteSpace: "pre-wrap",
    lineHeight: 1.2,
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
    marginTop: 20,
    textAlign: "center",
  },
});

const MyDocument = ({ title, content }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.content}>{content}</Text>
      <Text style={styles.end}>
        --------------------------------------END--------------------------------------
      </Text>
    </Page>
  </Document>
);

const PdfPreviewPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const savedTitle = localStorage.getItem("pdfTitle") || "No Title";
    const savedContent = localStorage.getItem("pdfContent") || "No Content";
    setTitle(savedTitle);
    setContent(savedContent);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <PDFViewer width="100%" height="100%">
        <MyDocument title={title} content={content} />
      </PDFViewer>
    </div>
  );
};

export default PdfPreviewPage;
