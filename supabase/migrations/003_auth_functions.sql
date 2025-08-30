-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
DECLARE
  user_role_value user_role;
BEGIN
  SELECT role INTO user_role_value
  FROM public.users
  WHERE id = user_id;
  
  RETURN COALESCE(user_role_value, 'USER');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = user_id) = 'ADMIN';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get cart total for a user
CREATE OR REPLACE FUNCTION public.get_cart_total(user_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  total DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(ci.quantity * p.price), 0)
  INTO total
  FROM public.cart_items ci
  JOIN public.products p ON ci.product_id = p.id
  WHERE ci.user_id = user_id;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get cart item count for a user
CREATE OR REPLACE FUNCTION public.get_cart_count(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COALESCE(SUM(quantity), 0)
  INTO count
  FROM public.cart_items
  WHERE user_id = user_id;
  
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get product average rating
CREATE OR REPLACE FUNCTION public.get_product_rating(product_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_rating DECIMAL(3,2);
BEGIN
  SELECT COALESCE(AVG(rating::DECIMAL), 0)
  INTO avg_rating
  FROM public.reviews
  WHERE product_id = product_id;
  
  RETURN avg_rating;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get product review count
CREATE OR REPLACE FUNCTION public.get_product_review_count(product_id UUID)
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO count
  FROM public.reviews
  WHERE product_id = product_id;
  
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;