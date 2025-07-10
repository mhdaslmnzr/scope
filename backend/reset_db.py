#!/usr/bin/env python3
"""
Database reset script for SCOPE platform
This will clear all existing data and regenerate with Deep Health Inc
"""

import os
import sys
from app import app, db, MockDataGenerator

def reset_database():
    """Reset the database and regenerate mock data"""
    with app.app_context():
        print("🗑️  Dropping all tables...")
        db.drop_all()
        
        print("🏗️  Creating new tables...")
        db.create_all()
        
        print("🏥 Generating Deep Health Inc and vendors...")
        clients_count = MockDataGenerator.generate_mock_clients()
        vendors_count = MockDataGenerator.generate_mock_vendors()
        
        print(f"✅ Successfully created {clients_count} clients and {vendors_count} vendors")
        print("🎉 Database reset complete!")

if __name__ == "__main__":
    reset_database() 