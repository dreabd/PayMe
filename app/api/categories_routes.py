from app.models import Category, db
from flask import Blueprint

category_routes = Blueprint('categories', __name__)

# -------- GET ALL ROUTE --------
@category_routes.route('/')
def get_categories():
    categories = Category.query.all()
    response = [category.to_dict() for category in categories]
    return { "categories": response }
