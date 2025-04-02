import { jsPDF } from 'jspdf';
import { fontNormal, fontBold } from './fontData';

export function applyFontForJsPDF(doc: jsPDF) {
    doc.addFileToVFS('Roboto.ttf', fontNormal);
    doc.addFont('Roboto.ttf', 'Roboto', 'normal', 'normal');
    doc.addFileToVFS('Roboto-Bold.ttf', fontBold);
    doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
    return doc;
}