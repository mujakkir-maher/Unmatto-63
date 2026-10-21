var SHEET_NAME = 'Registrations';
var HEADERS = [
  'Timestamp', 'Name', 'Student ID', 'Section', 'T-shirt', 'Mobile', 'WhatsApp same',
  'Gender', 'Guardian traveling?', 'Guardian name', 'Relation', 'Guardian mobile',
  'Guardian verified?', 'Verified by', 'Verified date', 'Notes'
];

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function safe_(v) {
  v = String(v == null ? '' : v);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#fde6cf');
    sh.getRange(2, 3, 2000, 1).setNumberFormat('@');
    sh.getRange(2, 6, 2000, 1).setNumberFormat('@');
    sh.getRange(2, 12, 2000, 1).setNumberFormat('@');
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Pending', 'Verified', 'Not reachable', 'Guardian declined'], true).build();
    sh.getRange(2, 13, 2000, 1).setDataValidation(rule);
  }
  return sh;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || body.secret !== secret) return out_({ ok: false, error: 'unauthorized' });
    if (!body.studentId || !body.name) return out_({ ok: false, error: 'invalid' });

    lock.waitLock(8000);
    var sh = sheet_();
    var id = String(body.studentId).trim();

    var last = sh.getLastRow();
    if (last > 1) {
      var ids = sh.getRange(2, 3, last - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === id) return out_({ ok: false, error: 'duplicate' });
      }
    }

    var ts = Utilities.formatDate(new Date(), 'Asia/Dhaka', 'yyyy-MM-dd HH:mm:ss');
    var row = [
      ts, safe_(body.name), id, safe_(body.section), safe_(body.tshirt || ''), safe_(body.mobile),
      body.whatsappSame ? 'Yes' : 'No', safe_(body.gender), safe_(body.bringGuardian || ''),
      safe_(body.guardianName), safe_(body.guardianRelation), safe_(body.guardianMobile),
      'Pending', '', '', ''
    ];
    var r = last + 1;
    sh.getRange(r, 3).setNumberFormat('@');
    sh.getRange(r, 6).setNumberFormat('@');
    sh.getRange(r, 12).setNumberFormat('@');
    sh.getRange(r, 1, 1, row.length).setValues([row]);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: 'server' });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  return ContentService.createTextOutput('OK');
}