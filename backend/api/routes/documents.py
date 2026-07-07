"""
Documents router — handles file uploads for MSME applications.

Supported document types:
  - gst_returns        (PDF / JSON)
  - bank_statement     (PDF)
  - itr                (PDF)
  - udyam_certificate  (PDF / image)
  - pan_card           (PDF / image)
  - upi_statement      (PDF / image)
  - trade_reference    (PDF)
"""

from fastapi import APIRouter, UploadFile, File, Form

router = APIRouter()

ALLOWED_DOC_TYPES = {
    "gst_returns",
    "bank_statement",
    "itr",
    "udyam_certificate",
    "pan_card",
    "upi_statement",
    "trade_reference",
}


@router.post("/{application_id}")
async def upload_document(
    application_id: str,
    file: UploadFile = File(...),
    doc_type: str = Form(...),
):
    """
    Upload a document for an application.

    In Phase 3, this will:
      1. Validate file type and size
      2. Save to secure storage
      3. Trigger the appropriate parser (gst_parser, bank_statement_parser, etc.)
      4. Update document status in DB
    """
    if doc_type not in ALLOWED_DOC_TYPES:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=f"Unknown document type: {doc_type}")

    # TODO: save file, invoke parser, update DB
    return {
        "applicationId": application_id,
        "docType": doc_type,
        "filename": file.filename,
        "status": "uploaded",
        "message": "Document received. Parsing will begin shortly.",
    }


@router.get("/{application_id}")
def list_documents(application_id: str):
    """List all documents uploaded for an application."""
    # TODO: fetch from database
    return {
        "applicationId": application_id,
        "documents": [
            {"name": "GST Returns (12 months)", "type": "gst_returns",    "status": "verified"},
            {"name": "Bank Statement",           "type": "bank_statement", "status": "verified"},
            {"name": "Udyam Certificate",        "type": "udyam_certificate", "status": "verified"},
            {"name": "ITR",                      "type": "itr",            "status": "pending"},
        ],
    }
