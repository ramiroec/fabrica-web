import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Paciente } from '../pages/interfaces/paciente';
import { RecomendacionDiagnostico } from '../pages/interfaces/recomendacion_diagnostico';

// Importa la fuente Roboto
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgVxIIzc.ttf', fontWeight: 'bold' },
  ],
});

// Estilos
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
  section: {
    margin: 10,
    padding: 20,
    border: '1px solid #ccc', // Añade un borde para distinguir la sección
    borderRadius: 5, // Bordes redondeados
  },
  header: {
    fontSize: 22,
    margin: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
  justifiedTextCenter: {
    textAlign: 'justify',
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.6,
  },
  // Nuevos estilos para las columnas
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  column: {
    width: '48%', // Dos columnas, cada una ocupa un 48% del ancho
  },
});

const MyDocument: React.FC<{ patientData: Paciente; itemPlan: RecomendacionDiagnostico[] }> = ({ patientData, itemPlan }) => {
  if (!patientData) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>No se encontraron datos del paciente</Text>
          </View>
        </Page>
      </Document>
    );
  }

  // Extracción de los datos del paciente
  const fechaNacimiento = new Date(patientData.fecha_nacimiento);
  const fechaNacimientoString = `${fechaNacimiento.getUTCDate()}/${fechaNacimiento.getUTCMonth() + 1}/${fechaNacimiento.getUTCFullYear()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo en la esquina superior izquierda */}
        <Image src="/image.png" style={styles.logo} />

        {/* Sección de datos del paciente */}
        <View style={styles.section}>
          <Text style={styles.header}>DATOS DEL PACIENTE</Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Nombre y Apellido: </Text>{patientData.nombre} {patientData.apellido}
          </Text>
          <View style={styles.columns}>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={styles.label}>Fecha de nacimiento: </Text>{fechaNacimientoString}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Fecha actual: </Text>{new Date().toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.text}>
                <Text style={styles.label}>Edad: </Text>{patientData.edad}
              </Text>
              <Text style={styles.text}>
                <Text style={styles.label}>Número de Documento:</Text> {patientData.numero_documento}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.header}>PLAN DE INTERVENCIÓN INICIAL</Text>
          {itemPlan && itemPlan.length > 0 ? (
            itemPlan.map((item, index) => (
              <Text key={index} style={styles.text}>
                {index + 1}. Intervención en el área de {item.especialidad}, {item.cantidad_sesiones} sesiones, {item.cantidad_veces_semana} veces por semana
              </Text>
            ))
          ) : (
            <Text style={styles.text}>No hay recomendaciones registradas.</Text>
          )}

          <Text style={styles.justifiedTextCenter}>
            Una vez realizadas las interconsultas solicitadas y luego del periodo de intervención que tiene como objetivo mejorar las habilidades de base con las que cuenta el niño; se recomienda iniciar el proceso de evaluación para determinar el diagnóstico y/o hipótesis diagnóstica tomando en cuenta la evolución durante el periodo de intervención, el desempeño del niño en las pruebas estandarizadas, la observación clínica y el análisis de los estudios médicos realizados.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
