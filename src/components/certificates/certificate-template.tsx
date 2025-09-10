'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';
import { CertificateData, CertificateTemplate } from '@/types';

// Register fonts (you can add custom fonts here)
// Font.register({
//   family: 'Roboto',
//   src: '/fonts/Roboto-Regular.ttf',
// });

interface CertificateTemplateProps {
  data: CertificateData;
  templateType: CertificateTemplate;
  qrCodeDataUrl?: string;
  verificationCode: string;
  issueDate: string;
}

// Common styles
const commonStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  recipientText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#34495e',
  },
  recipientName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textDecoration: 'underline',
  },
  achievementText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#34495e',
    lineHeight: 1.5,
  },
  testName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 20,
  },
  scoreSection: {
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 18,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 40,
    paddingTop: 20,
    borderTop: '2px solid #ecf0f1',
  },
  footerLeft: {
    flex: 1,
  },
  footerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  signatureText: {
    fontSize: 12,
    color: '#34495e',
    marginBottom: 5,
  },
  verificationSection: {
    textAlign: 'center',
  },
  qrCode: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  verificationCode: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  border: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    border: '4px solid #3498db',
  },
});

// Template-specific styles
const templateStyles = {
  STANDARD: StyleSheet.create({
    ...commonStyles,
    title: {
      ...commonStyles.title,
      color: '#3498db',
    },
    border: {
      ...commonStyles.border,
      border: '4px solid #3498db',
    },
  }),
  
  PROFESSIONAL: StyleSheet.create({
    ...commonStyles,
    page: {
      ...commonStyles.page,
      backgroundColor: '#f8f9fa',
    },
    title: {
      ...commonStyles.title,
      color: '#2c3e50',
      fontSize: 32,
    },
    border: {
      ...commonStyles.border,
      border: '6px solid #34495e',
    },
    testName: {
      ...commonStyles.testName,
      color: '#e74c3c',
    },
  }),
  
  ACADEMIC: StyleSheet.create({
    ...commonStyles,
    title: {
      ...commonStyles.title,
      color: '#8e44ad',
      fontSize: 30,
    },
    border: {
      ...commonStyles.border,
      border: '4px solid #9b59b6',
    },
    testName: {
      ...commonStyles.testName,
      color: '#8e44ad',
    },
  }),
  
  TECHNICAL: StyleSheet.create({
    ...commonStyles,
    title: {
      ...commonStyles.title,
      color: '#e67e22',
    },
    border: {
      ...commonStyles.border,
      border: '4px solid #f39c12',
    },
    testName: {
      ...commonStyles.testName,
      color: '#d35400',
    },
  }),
  
  LANGUAGE_PROFICIENCY: StyleSheet.create({
    ...commonStyles,
    title: {
      ...commonStyles.title,
      color: '#27ae60',
    },
    border: {
      ...commonStyles.border,
      border: '4px solid #2ecc71',
    },
    testName: {
      ...commonStyles.testName,
      color: '#27ae60',
    },
  }),
};

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  data,
  templateType,
  qrCodeDataUrl,
  verificationCode,
  issueDate,
}) => {
  const styles = templateStyles[templateType];
  
  const getTitleText = () => {
    switch (templateType) {
      case 'PROFESSIONAL':
        return 'Professional Certificate';
      case 'ACADEMIC':
        return 'Academic Achievement Certificate';
      case 'TECHNICAL':
        return 'Technical Proficiency Certificate';
      case 'LANGUAGE_PROFICIENCY':
        return 'Language Proficiency Certificate';
      default:
        return 'Certificate of Achievement';
    }
  };

  const getAchievementText = () => {
    const baseText = `has successfully completed the assessment for`;
    
    if (data.score !== undefined) {
      return `${baseText} and achieved a score of ${data.score}%`;
    }
    return baseText;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.border} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{getTitleText()}</Text>
          <Text style={styles.subtitle}>{data.organizationName}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.recipientText}>This is to certify that</Text>
          <Text style={styles.recipientName}>{data.recipientName}</Text>
          <Text style={styles.achievementText}>{getAchievementText()}</Text>
          <Text style={styles.testName}>{data.courseName}</Text>
          
          {data.proficiencyLevel && (
            <Text style={styles.achievementText}>
              Proficiency Level: {data.proficiencyLevel}
            </Text>
          )}
          
          {data.score !== undefined && (
            <View style={styles.scoreSection}>
              <Text style={styles.scoreText}>Score: {data.score}%</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.dateText}>Issue Date:</Text>
            <Text style={styles.dateText}>{issueDate}</Text>
            {data.testDuration && (
              <Text style={styles.dateText}>
                Duration: {data.testDuration} minutes
              </Text>
            )}
          </View>
          
          <View style={styles.footerCenter}>
            <Text style={styles.signatureText}>Authorized by:</Text>
            <Text style={styles.signatureText}>{data.instructorName}</Text>
          </View>
          
          <View style={styles.footerRight}>
            <View style={styles.verificationSection}>
              {qrCodeDataUrl && (
                <Image
                  style={styles.qrCode}
                  src={qrCodeDataUrl}
                />
              )}
              <Text style={styles.verificationCode}>
                Verification: {verificationCode}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CertificateTemplate;