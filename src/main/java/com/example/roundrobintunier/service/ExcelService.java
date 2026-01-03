package com.example.roundrobintunier.service;

import com.example.roundrobintunier.dto.PlayerRequestDTO;
import com.example.roundrobintunier.dto.TurnierSetupDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.io.ByteArrayOutputStream;

@Service
public class ExcelService {

    public TurnierSetupDTO importTurnierSetup(MultipartFile file) throws IOException {
        TurnierSetupDTO setup = new TurnierSetupDTO();
        List<PlayerRequestDTO> players = new ArrayList<>();

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            // --- 1. PARAMETER BLATT LESEN ---
            Sheet paramSheet = workbook.getSheet("Parameter");
            if (paramSheet != null) {
                // Wir lesen die Zellen B1, B2, B3... (Index 1)
                // Fehlerkorrektur: Wenn Zelle leer oder Quatsch -> Standardwert nehmen
                setup.setAnzahlPlaetze(getSafeInt(paramSheet, 0, 1, 1)); // Zeile 0, Spalte 1, Default 1
                setup.setAnzahlRunden(getSafeInt(paramSheet, 1, 1, 1));  // Zeile 1, Spalte 1, Default 1
                setup.setStartZeit(getSafeString(paramSheet, 2, 1, "09:00"));
                setup.setSpielDauerMin(getSafeInt(paramSheet, 3, 1, 60));
                setup.setPausenLaengeMin(getSafeInt(paramSheet, 4, 1, 10));
                // ForceMixed ist nicht im alten Excel, wir setzen es auf false
                setup.setForceMixed(false); 
            } else {
                // Fallback, falls Blatt fehlt
                setDefaultParams(setup);
            }

            // --- 2. SPIELER BLATT LESEN ---
            Sheet playerSheet = workbook.getSheet("Spieler");
            if (playerSheet != null) {
                // Starte bei Zeile 1 (Zeile 0 ist Header)
                for (int i = 1; i <= playerSheet.getLastRowNum(); i++) {
                    Row row = playerSheet.getRow(i);
                    if (row == null) continue;

                    String name = getCellStringValue(row.getCell(0));
                    
                    // KORREKTUR: Leere Namen überspringen
                    if (name == null || name.trim().isEmpty()) {
                        continue;
                    }

                    String geschlecht = getCellStringValue(row.getCell(1));
                    // KORREKTUR: Geschlecht normalisieren (M/F), Default M
                    if (geschlecht == null || (!geschlecht.equalsIgnoreCase("M") && !geschlecht.equalsIgnoreCase("F"))) {
                        geschlecht = "M"; 
                    } else {
                        geschlecht = geschlecht.toUpperCase();
                    }

                    int staerke = getCellIntValue(row.getCell(2));
                    // KORREKTUR: Stärke clampen (1-10)
                    if (staerke < 1) staerke = 1;
                    if (staerke > 10) staerke = 10;

                    players.add(new PlayerRequestDTO(name, geschlecht, staerke));
                }
            }
        }

        setup.setSpielerListe(players);
        return setup;
    }

    // --- Hilfsmethoden für Robustheit ---

    private void setDefaultParams(TurnierSetupDTO s) {
        s.setAnzahlPlaetze(1);
        s.setAnzahlRunden(1);
        s.setStartZeit("09:00");
        s.setSpielDauerMin(60);
        s.setPausenLaengeMin(10);
    }

    private int getSafeInt(Sheet sheet, int rowIdx, int colIdx, int defaultValue) {
        try {
            Row r = sheet.getRow(rowIdx);
            if (r == null) return defaultValue;
            return getCellIntValue(r.getCell(colIdx));
        } catch (Exception e) {
            return defaultValue;
        }
    }

    private String getSafeString(Sheet sheet, int rowIdx, int colIdx, String defaultValue) {
        try {
            Row r = sheet.getRow(rowIdx);
            if (r == null) return defaultValue;
            String val = getCellStringValue(r.getCell(colIdx));
            return (val == null || val.isEmpty()) ? defaultValue : val;
        } catch (Exception e) {
            return defaultValue;
        }
    }

    private int getCellIntValue(Cell cell) {
        if (cell == null) return 0;
        if (cell.getCellType() == CellType.NUMERIC) {
            return (int) cell.getNumericCellValue();
        } else if (cell.getCellType() == CellType.STRING) {
            try {
                return Integer.parseInt(cell.getStringCellValue().trim());
            } catch (NumberFormatException e) {
                return 0;
            }
        }
        return 0;
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null) return "";
        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            // Falls jemand eine Zahl als Namen eingibt
            return String.valueOf((int)cell.getNumericCellValue());
        }
        return "";
    }

    public byte[] exportTurnierToExcel(TurnierSetupDTO setup) throws IOException {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // --- 1. BLATT: PARAMETER ---
            Sheet paramSheet = workbook.createSheet("Parameter");

            // Helper um Zeilen zu schreiben (Label in Col 0, Wert in Col 1)
            createParamRow(paramSheet, 0, "Anzahl Plätze", String.valueOf(setup.getAnzahlPlaetze()));
            createParamRow(paramSheet, 1, "Anzahl Runden", String.valueOf(setup.getAnzahlRunden()));
            createParamRow(paramSheet, 2, "Startzeit", setup.getStartZeit());
            createParamRow(paramSheet, 3, "Spieldauer", String.valueOf(setup.getSpielDauerMin()));
            createParamRow(paramSheet, 4, "Pausenlänge", String.valueOf(setup.getPausenLaengeMin()));
            // Optional: Wir speichern 'Mixed' einfach in Zeile 5, auch wenn das alte Format das nicht kannte.
            // Dein Import stört das nicht, aber man könnte es später nutzen.
            createParamRow(paramSheet, 5, "Mixed Erzwingen", setup.isForceMixed() ? "true" : "false");

            // --- 2. BLATT: SPIELER ---
            Sheet spielerSheet = workbook.createSheet("Spieler");
            
            // Header
            Row headerRow = spielerSheet.createRow(0);
            headerRow.createCell(0).setCellValue("Name");
            headerRow.createCell(1).setCellValue("Geschlecht");
            headerRow.createCell(2).setCellValue("Spielstärke");

            // Daten
            List<PlayerRequestDTO> spieler = setup.getSpielerListe();
            if (spieler != null) {
                for (int i = 0; i < spieler.size(); i++) {
                    PlayerRequestDTO p = spieler.get(i);
                    Row row = spielerSheet.createRow(i + 1);
                    row.createCell(0).setCellValue(p.getName());
                    row.createCell(1).setCellValue(p.getGeschlecht());
                    row.createCell(2).setCellValue(p.getSpielstaerke());
                }
            }
            
            // Spaltenbreite automatisch anpassen (sieht schöner aus)
            spielerSheet.autoSizeColumn(0);
            spielerSheet.autoSizeColumn(1);
            spielerSheet.autoSizeColumn(2);

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void createParamRow(Sheet sheet, int rowIdx, String label, String value) {
        Row row = sheet.createRow(rowIdx);
        row.createCell(0).setCellValue(label);
        row.createCell(1).setCellValue(value);
    }
}