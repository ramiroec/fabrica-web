import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Paciente } from '../pages/interfaces/paciente';
import { Responsable } from '../pages/interfaces/responsable';

// Registrar la fuente Roboto
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgVxIIzc.ttf', fontWeight: 'bold' },
  ],
});

// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 11,
    lineHeight: 1.5,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    margin: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    margin: 10,
    padding: 20,
    border: '1px solid #ccc', // Borde para distinguir la sección
    borderRadius: 5, // Bordes redondeados
  },
  text: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.6,
  },
  boldText: {
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  justifiedText: {
    textAlign: 'justify',
    marginBottom: 10,
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  column: {
    width: '48%', // Dos columnas, cada una ocupa un 48% del ancho
  },
});

const MyConstanciaDocument: React.FC<{ patientData: Paciente; responsableData: Responsable; itemPlan: any[] }> = ({ patientData, responsableData, itemPlan }) => {
  // Extraer la fecha de nacimiento del paciente
  const fechaNacimiento = new Date(patientData.fecha_nacimiento);
  const fechaNacimientoString = `${fechaNacimiento.getUTCDate()}/${fechaNacimiento.getUTCMonth() + 1}/${fechaNacimiento.getUTCFullYear()}`;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo en la esquina superior izquierda */}
        <Image src="/image.png" style={styles.logo} />
        <View style={styles.section}>
          <Text style={styles.header}>DATOS DEL PACIENTE</Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Nombre y Apellido:</Text> {patientData.nombre} {patientData.apellido}
          </Text>
          <View style={styles.columns}>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={styles.label}>Fecha de nacimiento:</Text> {fechaNacimientoString}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Fecha Actual:</Text> {new Date().toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={styles.label}>Edad:</Text> {patientData.edad}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Número de Documento:</Text> {patientData.numero_documento}
              </Text>
            </View>
          </View>
        </View>
        <View>

          <Text style={styles.header}>CONSTANCIA</Text>

          <Text style={[styles.text, styles.justifiedText]}>
            Por medio de la presente, se deja constancia que el/la paciente {patientData.nombre} {patientData.apellido} con {patientData.tipo_documento} Nº {patientData.numero_documento}, asiste a las terapias en compañía de su {responsableData.tipo_relacion}, {responsableData.nombre} {responsableData.apellido} con {responsableData.tipo_documento} Nº {responsableData.numero_documento}. Cabe mencionar que el acompañamiento familiar es de suma importancia para el proceso terapéutico que se está llevando a cabo.
          </Text>

          <Text style={[styles.text, styles.justifiedText]}>
            Para los fines que el interesado estime, se expide el presente documento en la fecha {new Date().toLocaleDateString()}.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyConstanciaDocument;
