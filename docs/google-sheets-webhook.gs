/**
 * Google Apps Script Web App for the YesLeo order/contact webhook.
 *
 * Deploy as a Web app: Execute as Me, accessible to Anyone with the link.
 * The spreadsheet ID belongs here in Apps Script; the website .env is not
 * available to Apps Script.
 */
const SHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
const DEFAULT_TAB = "Orders";

const ORDER_HEADERS = [
  "timestamp",
  "recordId",
  "status",
  "paymentMethod",
  "amount",
  "currency",
  "items",
  "orderId",
  "razorpayOrderId",
  "razorpayPaymentId",
  "razorpaySignature",
  "name",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "pincode",
  "notes",
  "source",
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error("Missing POST body");
    const body = JSON.parse(e.postData.contents);
    const tab = body.sheet || DEFAULT_TAB;
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(tab);
    if (!sheet) throw new Error("Sheet tab not found: " + tab);

    if (tab === DEFAULT_TAB) {
      ensureHeaders_(sheet, ORDER_HEADERS);
      const customer = body.customer || body;
      sheet.appendRow([
        new Date(),
        createRecordId_(),
        body.status || "TEST",
        body.paymentMethod || (body.paymentId ? "razorpay" : "test"),
        body.amount || "",
        body.currency || "INR",
        formatItems_(body.items),
        body.orderId || "",
        body.razorpayOrderId || body.razorpay_order_id || "",
        body.razorpayPaymentId || body.razorpay_payment_id || body.paymentId || "",
        body.razorpaySignature || body.razorpay_signature || "",
        customer.name || "",
        customer.email || "",
        customer.phone || "",
        customer.address || "",
        customer.city || "",
        customer.state || "",
        customer.pincode || "",
        customer.notes || "",
        body.source || "website",
      ]);
    } else {
      const headers = Object.keys(body).filter(function (key) {
        return key !== "sheet";
      });
      ensureHeaders_(sheet, headers);
      sheet.appendRow(
        headers.map(function (key) {
          return body[key] ?? "";
        }),
      );
    }

    SpreadsheetApp.flush();
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

function formatItems_(items) {
  if (!items) return "";
  if (typeof items === "string") return items;
  if (!Array.isArray(items)) return JSON.stringify(items);
  return items
    .map(function (item) {
      return (
        "Name: " +
        (item.name || "") +
        " | Variant: " +
        (item.variantLabel || "") +
        " | Qty: " +
        (item.qty || 0) +
        " | Price: " +
        (item.price || "")
      );
    })
    .join("\n");
}

function createRecordId_() {
  return (
    "YL-" +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") +
    "-" +
    Utilities.getUuid().replace(/-/g, "").substring(0, 8).toUpperCase()
  );
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
