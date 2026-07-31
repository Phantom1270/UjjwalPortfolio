$c = Get-Content index.html -Raw -Encoding UTF8
$c = $c -replace 'Second-year CS student at VIT Chennai turning data and ideas\s*into real products\. I ship things that actually work\.', 'Third-year CS student at VIT Chennai — ML engineering, full-stack development, data science. National hackathon winner. I build things that actually ship.'
Set-Content index.html $c -Encoding UTF8
Write-Host "Bio fixed. Lines: $((Get-Content index.html).Count)"
