using AndcultureCode.CSharp.Sitefinity.Core.Interfaces;
using AndcultureCode.CSharp.Sitefinity.Core.Services;
using AndcultureCode.CSharp.Testing.Factories;
using AndcultureCode.CSharp.Testing.Tests;
using System;
using System.Net;
using System.Reflection;
using Xunit.Abstractions;

namespace AndcultureCode.CSharp.Sitefinity.Testing
{
    public class ODataServicesTestsBase<TService, TModel> : BaseTest
        where TModel : ISitefinityContentDto, new()
        where TService : ODataServices<TModel>
    {
        #region Members

        public static string SF_TEST_PREFIX = "sf_test_";

        public string AccessToken => Fixture.Session.AccessToken;
        public ODataSessionFixture Fixture { get; }
        public TModel Model { get; set; }
        public IODataConnectionSettings ODataConnectionSettings => Fixture.Session.ODataConnectionSettings;
        public TService Sut { get; set; }

        #endregion Members

        #region Setup and Teardown

        static ODataServicesTestsBase()
        {
            // Clear all factories
            FactoryExtensions.ClearFactoryDefinitions();

            // Load factories
            LoadFactories(typeof(ODataServicesTestsBase<TService, TModel>).GetTypeInfo().Assembly);
        }

        public ODataServicesTestsBase(
            ODataSessionFixture fixture,
            ITestOutputHelper output
        ) : base(output)
        {
            this.Fixture = fixture;
        }

        public override void Dispose()
        {
            base.Dispose();

            DisposeOfExistingModel(Sut, Model);
        }

        #endregion Setup and Teardown

        #region Public Methods

        public void DisposeOfExistingModel<TAnyModel>(ODataServices<TAnyModel> services, TAnyModel model) where TAnyModel : ISitefinityContentDto
        {
            if (model.Id.HasValue && services.GetItem(model.Id.Value).RestResponse.StatusCode == HttpStatusCode.OK)
            {
                services.Delete(model.Id.Value);
            }
        }

        public string GetRandomString(string fieldName)
        {
            return $"{SF_TEST_PREFIX}_{fieldName}_{Guid.NewGuid()}";
        }

        public void StartNewSession()
        {
            this.Fixture.Session.Authenticate();
        }

        #endregion Public Methods
    }
}
