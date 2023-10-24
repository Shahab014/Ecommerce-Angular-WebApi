using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ecommerceApi.Models
{
    public class AddProducts
    {
        public int Id { get; set; }
        public String ProductName { get; set; }
        public decimal ProductPrice { get; set; }
        public String  Color { get; set; }
        public String Category { get; set; }
        public String Description { get; set; }
        public String avatar { get; set; }
    }
}