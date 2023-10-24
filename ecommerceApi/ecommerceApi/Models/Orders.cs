using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ecommerceApi.Models
{
    public class Orders
    {
        public String email { get; set; }
        public String address { get; set; }
        public String contact { get; set; }
        public int totalPrice { get; set; }
        public int userId { get; set; }
       
    }
}