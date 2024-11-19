using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Xunit.BuildTools.Models;

namespace Xunit.BuildTools.Targets;

[Target(
	BuildTarget.TestFxMTP,
	BuildTarget.Build
)]
public static class TestFxMTP
{
	static readonly string refSubPath = Path.DirectorySeparatorChar + "ref" + Path.DirectorySeparatorChar;

	public static async Task OnExecute(BuildContext context)
	{
		// ------------- AnyCPU -------------

		context.BuildStep($"Running .NET Framework tests (AnyCPU, via 'dotnet test' with Microsoft.Testing.Platform)");

		await RunTestAssemblies(context, "dotnet", "xunit.v3.*.tests.exe", x86: false);

		// ------------- Forced x86 -------------

		if (!context.NoX86)
		{
			var x86Dotnet = context.GetDotnetX86Path(requireSdk: true);
			if (x86Dotnet is not null)
			{
				context.BuildStep($"Running .NET Framework tests (x86, via 'dotnet test' with Microsoft.Testing.Platform)");

				await RunTestAssemblies(context, x86Dotnet, "xunit.v3.*.tests.exe", x86: true);
			}
		}

		// Clean out all the 'dotnet test' log files, because if we got this far everything succeeded
		foreach (var logFile in Directory.GetFiles(context.TestOutputFolder, "*.log"))
			File.Delete(logFile);
	}

	static async Task RunTestAssemblies(
		BuildContext context,
		string dotnetPath,
		string searchPattern,
		bool x86)
	{
		var binSubPath = Path.Combine("bin", context.ConfigurationText, "net4");
		var testAssemblies =
			Directory
				.GetFiles(context.BaseFolder, searchPattern, SearchOption.AllDirectories)
				.Where(x => x.Contains(binSubPath) && !x.Contains(refSubPath) && (x.Contains(".x86") == x86))
				.OrderBy(x => x);

		foreach (var testAssembly in testAssemblies)
		{
			var outputFileName = $"{Path.GetFileNameWithoutExtension(testAssembly)}-net472-{(x86 ? "x86" : "AnyCPU")}-mtp";
			var projectFolder = Path.GetDirectoryName(Path.GetDirectoryName(Path.GetDirectoryName(Path.GetDirectoryName(testAssembly))));

			await context.Exec(dotnetPath, $"test {projectFolder} --configuration {context.ConfigurationText} --framework net472 --no-build --no-restore -- {context.TestFlagsParallelMTP}--pre-enumerate-theories on --results-directory \"{context.TestOutputFolder}\" --report-xunit --report-xunit-filename \"{outputFileName}.xml\" --report-xunit-html --report-xunit-html-filename \"{outputFileName}.html\" --report-ctrf --report-ctrf-filename \"{outputFileName}.ctrf\"", workingDirectory: context.BaseFolder);
		}
	}
}