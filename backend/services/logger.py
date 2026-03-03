import logging
import sys
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("backend.log")
    ]
)

def get_logger(name: str):
    logger = logging.getLogger(name)
    return logger

def log_event(name: str, message: str, level: str = "INFO"):
    logger = get_logger(name)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    full_message = f"[{timestamp}] {message}"
    
    if level == "INFO":
        logger.info(full_message)
    elif level == "ERROR":
        logger.error(full_message)
    elif level == "WARNING":
        logger.warning(full_message)
    elif level == "DEBUG":
        logger.debug(full_message)
