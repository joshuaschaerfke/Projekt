# Einkaufsplaner – Webanwendung für Einkaufslisten mit Einkaufsmodus

## Projektbeschreibung

In diesem Projekt wird eine Webanwendung entwickelt, die den gesamten Ablauf eines Einkaufs unterstützt.

Nutzer können Artikel zu einer Einkaufsliste hinzufügen, bearbeiten und löschen. Zusätzlich gibt es einen sogenannten „Einkaufsmodus“, der während des Einkaufs verwendet werden kann. In diesem Modus können Artikel, die bereits eingesammelt wurden, in einen virtuellen Einkaufswagen verschoben werden.

Der Fokus liegt dabei nicht nur auf einer einfachen Liste, sondern auf der Verwaltung von konkreten Einkaufsdaten und dem Ablauf eines Einkaufsprozesses.

## Ziel der Anwendung

Die Anwendung soll das Einkaufen strukturieren und übersichtlicher machen. Dabei wird zwischen zwei Phasen unterschieden:

**1. Planung (vor dem Einkauf):**
- Artikel hinzufügen
- Mengen festlegen
- Kategorien zuweisen
- Notizen ergänzen
- Einträge bearbeiten oder löschen

**2. Durchführung (im Laden):**
- Einkaufsliste öffnen
- Artikel in einen virtuellen Einkaufswagen verschieben
- Überblick behalten, was noch fehlt


## Verwaltete Daten

Die Anwendung speichert und verarbeitet verschiedene Informationen zu jedem Artikel:

- Name des Artikels
- Menge
- optionale Notiz (z. B. Marke)
- Status (auf Liste / im Einkaufswagen / gekauft)

Diese Daten können erstellt, angezeigt, bearbeitet und gelöscht werden.


## Funktionsweise

**Erstellen:**
Neue Artikel können über ein Formular hinzugefügt werden.

**Anzeigen:**
Alle Artikel werden in einer Liste dargestellt.

**Bearbeiten:**
Bestehende Artikel können geändert werden (z. B. Menge oder Kategorie).

**Löschen:**
Artikel können aus der Liste entfernt werden.

**Statusverwaltung:**
Artikel können ihren Status ändern, z. B.:
- noch auf der Liste
- im Einkaufswagen
- gekauft

**Einkaufsmodus:**
Im Einkaufsmodus können Artikel während des Einkaufs direkt „abgehakt“ werden, indem sie in einen virtuellen Einkaufswagen verschoben werden.


## Seitenstruktur

Die Anwendung besteht aus mehreren Bereichen:

**Startseite**
- kurze Einführung
- Navigation zur Einkaufsliste, Artikel-Formula und Einkaufsmodus

**Einkaufsliste**
- Übersicht aller Artikel
- Hinzufügen, Bearbeiten und Löschen möglich

**Artikel-Formular**
- Eingabe von neuen Artikeln
- Bearbeitung bestehender Einträge

**Einkaufsmodus**
- spezielle Ansicht für den Einkauf
- Artikel können in den Warenkorb verschoben werden
- Übersicht über offene und erledigte Artikel
