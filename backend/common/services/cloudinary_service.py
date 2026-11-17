
import cloudinary.uploader


def upload_image(image, folder, transformation=None):
    """
    Upload an image to Cloudinary.

    Returns the Cloudinary public ID and secure URL.
    """

    options = {
        "folder": folder,
        "resource_type": "image",
        "overwrite": False,
    }

    if transformation:
        options["transformation"] = transformation

    result = cloudinary.uploader.upload(
        image,
        **options
    )

    return {
        "public_id": result["public_id"],
        "secure_url": result["secure_url"],
    }


def delete_image(public_id):
    """
    Delete an image from Cloudinary using its public ID.
    """

    if not public_id:
        return None

    return cloudinary.uploader.destroy(
        public_id,
        resource_type="image",
        invalidate=True
    )
