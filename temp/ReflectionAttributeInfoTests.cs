using System;
using System.Linq;
using System.Reflection;
using Xunit;
using Xunit.Sdk;

public class ReflectionAttributeInfoTests
{
	public class ConstructorArgs
	{
		// https://github.com/xunit/xunit/issues/2796
		[CulturedFact("en-US", "fo-FO")]
		public void CanConvertEnumArgs()
		{
			var method = typeof(ConstructorArgs).GetRuntimeMethod(nameof(UnusedFunction), new Type[0]);
			Assert.NotNull(method);
			var attributeData = method.GetCustomAttributesData();
			Assert.NotNull(attributeData);
			var attributeDatum = Assert.Single(attributeData);
			var attribute = new ReflectionAttributeInfo(attributeDatum);

			var ctorArgs = attribute.GetConstructorArguments();

			var ctorArg = Assert.Single(ctorArgs);
			var inlineArgData = Assert.IsType<object[]>(ctorArg);
			var inlineArgDatum = Assert.Single(inlineArgData);
			var enumValue = Assert.IsType<EnumWithNegativeValue>(inlineArgDatum);
			Assert.Equal(EnumWithNegativeValue.NegativeOne, enumValue);
		}

		enum EnumWithNegativeValue
		{
			NegativeOne = -1,
		}

		[InlineData(EnumWithNegativeValue.NegativeOne)]
		public void UnusedFunction() { }
	}

	public class GetNamedArgument
	{
		public class NamedValueDoesNotExist
		{
			class AttributeUnderTest : Attribute { }

			[AttributeUnderTest]
			class ClassWithAttribute { }

			[Fact]
			public void Throws()
			{
				var attributeData = CustomAttributeData.GetCustomAttributes(typeof(ClassWithAttribute)).Single(cad => cad.AttributeType == typeof(AttributeUnderTest));
				var attributeInfo = new ReflectionAttributeInfo(attributeData);

				var ex = Record.Exception(() => attributeInfo.GetNamedArgument<int>("IntValue"));

				var argEx = Assert.IsType<ArgumentException>(ex);
				Assert.StartsWith("Could not find property or field named 'IntValue' on instance of 'ReflectionAttributeInfoTests+GetNamedArgument+NamedValueDoesNotExist+AttributeUnderTest'", argEx.Message);
				Assert.Equal("argumentName", argEx.ParamName);
			}
		}

		public class Properties
		{
			class AttributeUnderTest : Attribute
			{
				public int IntValue { get; set; }
			}

			[AttributeUnderTest(IntValue = 42)]
			class ClassWithAttributeValue { }

			[Fact]
			public void ReturnsValue()
			{
				var attributeData = CustomAttributeData.GetCustomAttributes(typeof(ClassWithAttributeValue)).Single(cad => cad.AttributeType == typeof(AttributeUnderTest));
				var attributeInfo = new ReflectionAttributeInfo(attributeData);

				var result = attributeInfo.GetNamedArgument<int>("IntValue");

				Assert.Equal(42, result);
			}

			[AttributeUnderTest]
			class ClassWithoutAttributeValue { }

			[Fact]
			public void ReturnsDefaultValueWhenValueIsNotSet()
			{
				var attributeData = CustomAttributeData.GetCustomAttributes(typeof(ClassWithoutAttributeValue)).Single(cad => cad.AttributeType == typeof(AttributeUnderTest));
				var attributeInfo = new ReflectionAttributeInfo(attributeData);

				var result = attributeInfo.GetNamedArgument<int>("IntValue");

				Assert.Equal(0, result);
			}
		}

		public class Fields
		{
			class AttributeUnderTest : Attribute
			{
				public int IntValue;
			}

			[AttributeUnderTest(IntValue = 42)]
			class ClassWithAttributeValue { }

			[Fact]
			public void ReturnsValue()
			{
				var attributeData = CustomAttributeData.GetCustomAttributes(typeof(ClassWithAttributeValue)).Single(cad => cad.AttributeType == typeof(AttributeUnderTest));
				var attributeInfo = new ReflectionAttributeInfo(attributeData);

				var result = attributeInfo.GetNamedArgument<int>("IntValue");

				Assert.Equal(42, result);
			}

			[AttributeUnderTest]
			class ClassWithoutAttributeValue { }

			[Fact]
			public void ReturnsDefaultValueWhenValueIsNotSet()
			{
				var attributeData = CustomAttributeData.GetCustomAttributes(typeof(ClassWithoutAttributeValue)).Single(cad => cad.AttributeType == typeof(AttributeUnderTest));
				var attributeInfo = new ReflectionAttributeInfo(attributeData);

				var result = attributeInfo.GetNamedArgument<int>("IntValue");

				Assert.Equal(0, result);
			}
		}
	}
}
