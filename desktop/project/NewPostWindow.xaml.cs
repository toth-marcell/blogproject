using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Net.Http;
using Newtonsoft.Json;
namespace project
{
    /// <summary>
    /// Interaction logic for NewPostWindow.xaml
    /// </summary>
    public partial class NewPostWindow : Window
    {
        public NewPostWindow()
        {
            InitializeComponent();
        }
        private async void submitButton_Click(object sender, RoutedEventArgs e)
        {
            StringContent body = new StringContent(JsonConvert.SerializeObject(new NewPostBody(titleField.Text, textField.Text)), Encoding.UTF8, "application/json");
            HttpResponseMessage result = await API.httpClient.PostAsync(API.APIURL + "/newpost", body);
            var content = await result.Content.ReadAsStringAsync();
            try
            {
                result.EnsureSuccessStatusCode();
                MessageBox.Show("Success!");
            }
            catch
            {
                var msg = JsonConvert.DeserializeObject<APIError>(content).msg;
                MessageBox.Show(msg, "Fail :(");
            }
            DialogResult = true;
        }
    }
    class NewPostBody
    {
        public NewPostBody(string title, string text)
        {
            this.title = title;
            this.text = text;
        }
        public string token => LoggedInUser.Token;
        public string title { get; set; }
        public string text { get; set; }
    }
}
