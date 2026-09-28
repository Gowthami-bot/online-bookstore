@REM Online Bookstore Maven Wrapper
@echo off
set MAVEN_EXE="C:\Users\Gowthami\.tools\apache-maven-3.9.8\bin\mvn.cmd"
if exist %MAVEN_EXE% (
    %MAVEN_EXE% %*
) else (
    mvn %*
)
