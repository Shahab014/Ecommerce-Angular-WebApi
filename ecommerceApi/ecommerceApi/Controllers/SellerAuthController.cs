using System;
using System.Net.Http;
using System.Net;
using System.Configuration;
using System.Web.Http;
using System.Data.SqlClient;
using ecommerceApi.Models;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Cryptography;
using System.Web;
using System.IO;
using System.Net.Http.Headers;
using System.Data;

namespace ecommerceApi.Controllers
{
    public class SellerAuthController : ApiController
    {
        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["connection"]
            .ConnectionString;

        static SellerDetails seller = new SellerDetails();

        [HttpPost]
        [Route("api/register")]
        public IHttpActionResult Register([FromBody] SellerDetails details)
        {
            String sqlQuery = "INSERT INTO sellerDetails (name, email, password, role) VALUES (@name, @email, @password, @role)";
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand(sqlQuery, connection);
                    command.Parameters.AddWithValue("@name", details.Name);
                    command.Parameters.AddWithValue("@email", details.Email);
                    command.Parameters.AddWithValue("@password", details.Password);
                    command.Parameters.AddWithValue("@role", details.Role);
                    connection.Open();
                    command.ExecuteNonQuery();
                }
                return Ok("Data Added Successfully");
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Route("api/login")]
        public IHttpActionResult Login([FromBody] SellerDetails user)
        {
            if (IsValidSeller(user.Email, user.Password, user.Role, out string name, out string role, out int id))
            {
                user.Name = name;
                user.Role = role;
                var token = GenerateToken(user.Email, user.Name, user.Role, id);

                var refereshToken = GenerateRefreshToken();
                SetRefreshToken(refereshToken);
                return Ok(new { Token = token });
               // return Ok(token);
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        [Route("api/refresh-token")]
        public IHttpActionResult RefreshToken()
        {
            var refreshToken = HttpContext.Current.Request.Cookies["refreshToken"];

            if (!seller.RefreshToken.Equals(refreshToken))
            {
                return Content(HttpStatusCode.Unauthorized, "Invalid Refresh Token.");
            }
            else if (seller.TokenExpires < DateTime.Now)
            {
                return Content(HttpStatusCode.Unauthorized, "Token Expired");
            }

            string token = GenerateToken(seller.Email, seller.Name, seller.Role, 1);
            var newRefreshToken = GenerateRefreshToken();
            SetRefreshToken(newRefreshToken);

            return Ok(token);
        }

        private RefreshToken GenerateRefreshToken()
        {
            var rng = new RNGCryptoServiceProvider();
            byte[] data = new byte[64];
            rng.GetBytes(data);
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(data),
                Expires = DateTime.Now.AddDays(7),
                Created = DateTime.Now
            };

            return refreshToken;
        }

        private void SetRefreshToken(RefreshToken newRefreshToken)
        {
            
            var cookie = new HttpCookie("refreshToken", newRefreshToken.Token)
            {
                HttpOnly = true,
                Expires = newRefreshToken.Expires
            };
            HttpContext.Current.Response.Cookies.Add(cookie);
            seller.RefreshToken = newRefreshToken.Token;
            seller.TokenCreated = newRefreshToken.Created;
            seller.TokenExpires = newRefreshToken.Expires;
        }

        private bool IsValidSeller(string email, string pwd, string sellerRole, out string name, out string role, out int id)
        {
            name = ""; role=""; id = 0;
            string sqlQuery = "SELECT * from sellerDetails WHERE email = @email AND password = @pass AND role = @role";
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(sqlQuery, connection);
                command.Parameters.AddWithValue("@email", email);
                command.Parameters.AddWithValue("@pass", pwd);
                command.Parameters.AddWithValue("@role", sellerRole);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    name = reader["name"].ToString();
                    role = reader["role"].ToString();
                    id = Convert.ToInt32(reader["id"]);
                }
                return reader.HasRows;
            }
        }

        private string GenerateToken(string email, string name, string role, int id)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, name),
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(ClaimTypes.NameIdentifier,id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Thi$i$very$trong@&Key#for@Authentic@tion"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "http://localhost:56952",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(1),
                signingCredentials: creds
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost]
        [Route("api/seller-add-product")]
        public IHttpActionResult AddProducts(AddProducts addProduct)
        {
            
            //String SqlQuery = "INSERT INTO AddProducts (ProductName, ProductPrice, Color, Category, Description, ImageName) " +
            //    " VALUES (@ProductName, @ProductPrice, @Color, @Category, @Description, @ImageName)";
           
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    var cmd = new SqlCommand("AddProductsProcedure", connection);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ProductName", addProduct.ProductName);
                    cmd.Parameters.AddWithValue("@ProductPrice", addProduct.ProductPrice);
                    cmd.Parameters.AddWithValue("@Color", addProduct.Color);
                    cmd.Parameters.AddWithValue("@Category", addProduct.Category);
                    cmd.Parameters.AddWithValue("@Description", addProduct.Description);

                    cmd.Parameters.AddWithValue("@ImageName", addProduct.avatar);

                    connection.Open();
                    cmd.ExecuteNonQuery();
                    connection.Close();
                }
                return Ok("Image uploaded successfully.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }     
        }

        [HttpGet]
        [Route("api/seller-product-list")]
        public IHttpActionResult GetProductList()
        {
            try
            {
                DataTable table = new DataTable();
                using(SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlDataAdapter adapter = new SqlDataAdapter("SELECT * FROM AddProducts", connection);
                    adapter.Fill(table);
                }
                return Ok(table);
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpDelete]
        [Route("api/seller-delete-product/{id}")]
        public IHttpActionResult DeleteProduct(int id)
        {
            try
            {
                String sqlQuey = "DELETE FROM AddProducts where id = @id";
                using(SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand(sqlQuey, connection);
                    command.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    command.ExecuteNonQuery();
                }
                return Ok("Deleted Successfully");
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        }
        
        [HttpGet]
        [Route("api/seller-getProduct/{id}")]
        public IHttpActionResult GetProduct(int id)
        {
            try
            {
                DataTable table = new DataTable();
                using(SqlConnection connection = new SqlConnection(connectionString))
                {                    
                    SqlDataAdapter adapter = new SqlDataAdapter("SELECT * FROM AddProducts where id = @id", connection);
                    adapter.SelectCommand.Parameters.AddWithValue("@id", id);
                    adapter.Fill(table);                    
                }
                return Ok(table);
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPut]
        [Route("api/seller-update-product/{id}")]
        public IHttpActionResult UpdateProduct(int Id, AddProducts addProduct)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    var cmd = new SqlCommand("SellerUpdateProduct", connection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("Id", Id);
                    cmd.Parameters.AddWithValue("@ProductName", addProduct.ProductName);
                    cmd.Parameters.AddWithValue("@ProductPrice", addProduct.ProductPrice);
                    cmd.Parameters.AddWithValue("@Color", addProduct.Color);
                    cmd.Parameters.AddWithValue("@Category", addProduct.Category);
                    cmd.Parameters.AddWithValue("@Description", addProduct.Description);
                    cmd.Parameters.AddWithValue("@avatar", addProduct.avatar);

                    connection.Open();
                    cmd.ExecuteNonQuery();
                    connection.Close();
                }
                return Ok("Data Updated successfully.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/limited-Products")]
        public DataTable GetLimitedProducts()
        {
            DataTable table = new DataTable();
            using(SqlConnection conn = new SqlConnection(connectionString))
            {
                SqlDataAdapter adapter = new SqlDataAdapter("SELECT TOP 3* from AddProducts", conn);
                adapter.Fill(table);
            }
            return table;
        }

        [HttpGet]
        [Route("api/limited-trendyProducts")]
        public DataTable TrendyProducts()
        {
            DataTable table = new DataTable();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                SqlDataAdapter adapter = new SqlDataAdapter("SELECT TOP 8* from AddProducts", conn);
                adapter.Fill(table);
            }
            return table;
        }

        [HttpPost]
        [Route("api/addToCart")]
        public IHttpActionResult AddToCart(Cart cart)
        {
            try
            {
                using(SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("saveCart", connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@productId", cart.productId);
                    command.Parameters.AddWithValue("@userId", cart.userId);
                    command.Parameters.AddWithValue("@ProductName", cart.ProductName);
                    command.Parameters.AddWithValue("@ProductPrice", cart.ProductPrice);
                    command.Parameters.AddWithValue("@Category", cart.Category);
                    command.Parameters.AddWithValue("@Color", cart.Color);
                    command.Parameters.AddWithValue("@quantity", cart.quantity);
                    command.Parameters.AddWithValue("@Description", cart.Description);
                    command.Parameters.AddWithValue("@avatar", cart.avatar);
                    connection.Open();
                    command.ExecuteNonQuery();
                }
                return Ok("Cart Added Successfully");
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("api/cart/{id}")]
        public IHttpActionResult CartProducts(int id)
        {
            DataTable table = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlDataAdapter adapter = new SqlDataAdapter("select * from cart where userId = @id", connection);
                    adapter.SelectCommand.Parameters.AddWithValue("@id", id);
                    adapter.Fill(table);
                }
                return Ok(table);
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpDelete]
        [Route("api/remove-item-from-cart/{id}")] 
        public IHttpActionResult RemoveItemFromCart(int id)
        {
            try
            {
                using(SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("DELETE FROM cart WHERE id = @id", connection);
                    command.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    command.ExecuteNonQuery();
                }
                return Ok("Data Successfully deleted");
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Route("api/orders")]
        public IHttpActionResult Orders(Orders order)
        {
            string query = "INSERT INTO orders VALUES (@email, @address, @contact, @totalPrice, @userId)";
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    var cmd = new SqlCommand(query, connection);       
                    cmd.Parameters.AddWithValue("@email", order.email);
                    cmd.Parameters.AddWithValue("@address", order.address);
                    cmd.Parameters.AddWithValue("@contact", order.contact);
                    cmd.Parameters.AddWithValue("@totalPrice", order.totalPrice);
                    cmd.Parameters.AddWithValue("@userId", order.userId);

                    connection.Open();
                    cmd.ExecuteNonQuery();
                    connection.Close();
                }
                return Ok("Data Updated successfully.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/orderList/{id}")]
        public IHttpActionResult OrderList(int id)
        {
            DataTable table = new DataTable();
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlDataAdapter adapter = new SqlDataAdapter("select * from orders where userId = @id", connection);
                    adapter.SelectCommand.Parameters.AddWithValue("@id", id);
                    adapter.Fill(table);
                }
                return Ok(table);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpDelete]
        [Route("api/deleteCartItem/{id}")]
        public IHttpActionResult DeleteCartItems(int id)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("DELETE FROM cart WHERE userId = @id", connection);
                    command.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    command.ExecuteNonQuery();
                }
                return Ok("Data Successfully deleted");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpDelete]
        [Route("api/cancelOrder/{id}")]
        public IHttpActionResult CancelOrder(int id)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    SqlCommand command = new SqlCommand("DELETE FROM orders WHERE id = @id", connection);
                    command.Parameters.AddWithValue("@id", id);
                    connection.Open();
                    command.ExecuteNonQuery();
                }
                return Ok("Data Successfully deleted");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


        [HttpPost]
        [Route("api/pic")]
        public IHttpActionResult UploadImage()
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;

                // Check if a file is posted
                if (httpRequest.Files.Count > 0)
                {
                    HttpPostedFile imageFile = httpRequest.Files[0];

                    // Check if an image file was provided
                    if (imageFile != null)
                    {
                        // Convert the image file to a byte array
                        byte[] imageBytes;
                        using (var binaryReader = new BinaryReader(imageFile.InputStream))
                        {
                            imageBytes = binaryReader.ReadBytes(imageFile.ContentLength);
                        }

                        // Insert the image data into the database
                        using (SqlConnection connection = new SqlConnection(connectionString))
                        {
                            connection.Open();

                            string insertQuery = "INSERT INTO pic (image) VALUES (@ImageData)";

                            SqlCommand cmd = new SqlCommand(insertQuery, connection);
                            cmd.Parameters.AddWithValue("@ImageData", imageBytes);

                            cmd.ExecuteNonQuery();
                        }

                        return Ok("Image uploaded successfully.");
                    }
                    else
                    {
                        return BadRequest("Image file not provided.");
                    }
                }
                else
                {
                    return BadRequest("No files were uploaded.");
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/getimage/{imageId}")]
        public IHttpActionResult GetImage(int imageId)
        {
            try
            {
                byte[] imageData = null;

                // Query the database to retrieve the image data based on the image ID
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    string query = "SELECT image FROM pic WHERE id = @ImageId";

                    SqlCommand cmd = new SqlCommand(query, connection);
                    cmd.Parameters.AddWithValue("@ImageId", imageId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            imageData = (byte[])reader["image"];
                        }
                    }
                }

                if (imageData != null)
                {
                    // Set the appropriate content type (e.g., image/jpeg)
                    var response = new HttpResponseMessage(HttpStatusCode.OK);
                    response.Content = new ByteArrayContent(imageData);
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg"); // Modify for other image formats

                    return ResponseMessage(response);
                }
                else
                {
                    return NotFound(); // Image not found
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
       
    }
}
