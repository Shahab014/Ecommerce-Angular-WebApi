using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ecommerceApi.Models
{
    public class SellerDetails
    {
        public String Name { get; set; }
        public String Email { get; set; }
        public String Password { get; set; }
        public String Role { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime TokenCreated { get; set; }
        public DateTime TokenExpires { get; set; }

    }
}