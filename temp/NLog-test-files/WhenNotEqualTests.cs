//
// Copyright (c) 2004-2024 Jaroslaw Kowalski <jaak@jkowalski.net>, Kim Christensen, Julian Verdurmen
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
// * Redistributions of source code must retain the above copyright notice,
//   this list of conditions and the following disclaimer.
//
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// * Neither the name of Jaroslaw Kowalski nor the names of its
//   contributors may be used to endorse or promote products derived from this
//   software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
// THE POSSIBILITY OF SUCH DAMAGE.
//

namespace NLog.UnitTests.Filters
{
    using Xunit;

    public class WhenNotEqualTests : NLogTestBase
    {
        [Fact]
        public void WhenNotEqualTest()
        {
            var logFactory = new LogFactory().Setup().LoadConfigurationFromXml(@"
            <nlog>
                <targets><target name='debug' type='Debug' layout='${message}' /></targets>
                <rules>
                    <logger name='*' minlevel='Debug' writeTo='debug'>
                    <filters defaultAction='log'>
                        <whenNotEqual layout='${message}' compareTo='skipme' action='Ignore' />
                    </filters>
                    </logger>
                </rules>
            </nlog>").LogFactory;

            var logger = logFactory.GetLogger("A");
            logger.Debug("skipme");
            logFactory.AssertDebugLastMessage("skipme");

            logger.Debug("a");
            logFactory.AssertDebugLastMessage("skipme");

            logger.Debug("SkipMe");
            logFactory.AssertDebugLastMessage("skipme");
        }

        [Fact]
        public void WhenNotEqualInsensitiveTest()
        {
            var logFactory = new LogFactory().Setup().LoadConfigurationFromXml(@"
            <nlog>
                <targets><target name='debug' type='Debug' layout='${message}' /></targets>
                <rules>
                    <logger name='*' minlevel='Debug' writeTo='debug'>
                    <filters defaultAction='log'>
                        <whenNotEqual layout='${message}' compareTo='skipmetoo' action='Ignore' ignoreCase='true' />
                    </filters>
                    </logger>
                </rules>
            </nlog>").LogFactory;

            var logger = logFactory.GetLogger("A");
            logger.Debug("skipMeToo");
            logFactory.AssertDebugLastMessage("skipMeToo");

            logger.Debug("skipmetoo");
            logFactory.AssertDebugLastMessage("skipmetoo");

            logger.Debug("dontskipme");
            logFactory.AssertDebugLastMessage("skipmetoo");

            logger.Debug("a");
            logFactory.AssertDebugLastMessage("skipmetoo");
        }
    }
}