#!/usr/bin/env pwsh

<#
SAMPLE:

// THIS FILE IS AUTO-GENERATED AND MANAGED BY GITHUB ACTIONS. MANUAL MODIFICATIONS
// CAN BREAK THINGS IF YOU DO NOT KNOW WHAT YOU ARE DOING! *YOU* HAVE BEEN WARNED!
{
  "LastBuildNum": 46,
  "LastVersions": {
    "1.0.0": 20,
    "1.0.1": 10,
    "1.1.0": 9,
    "1.2.0": 7
  }
}

#>


[CmdletBinding()]
param(
    [string]$GitHubToken,
    [string]$VersionKey=""
)

$ghWorkflow = $env:GITHUB_WORKFLOW   ## Name of workflow
Write-Information "Workflow: [$ghWorkflow]"

$ghRepoFull = $env:GITHUB_REPOSITORY ## owner/repo-name
($ghOwner, $ghRepo) = $ghRepoFull -split '/'
Write-Information "Repo Owner: [$ghOwner]"
Write-Information "Repo Name:  [$ghRepo]"

$metadataFilename = "GITHUB_ACTION_METADATA:$ghRepo"
Write-Information "Looking for metadata file: [$metadataFilename]"

$gistsApiUrl = "https://api.github.com/gists"
$apiHeaders = @{
    Accept        = "application/vnd.github.v2+json"
    Authorization = "token $GitHubToken"
}

try {
    ## Request all Gists for the current user
    $listGistsResp = Invoke-WebRequest -Headers $apiHeaders -Uri $gistsApiUrl -ErrorAction Stop

    ## Parse response content as JSON
    $listGists = $listGistsResp.Content | ConvertFrom-Json -AsHashtable
    Write-Information "Got [$($listGists.Count)] Gists for current account"
    ## Isolate the first Gist with a file matching the expected metadata name
    $metadataGist = $listGists | Where-Object { $_.files.$metadataFilename } | Select-Object -First 1
    $metadata = $null

    if ($metadataGist) {
        Write-Information "We found it!"
        $metadataRawUrl = $metadataGist.files.$metadataFilename.raw_url
        Write-Information "Fetching metadata content from Raw Url"
        $metadataRawResp = Invoke-WebRequest -Headers $apiHeaders -Uri $metadataRawUrl -ErrorAction Stop
        $metadataContent = $metadataRawResp.Content
        $metadata = $metadataContent | ConvertFrom-Json -AsHashtable -ErrorAction Continue
        if (-not $metadata) {
            Write-Warning "Metadata content seems to be either missing or unparsable JSON:"
            Write-Warning "[$($metadataGist.files.$metadataFilename)]"
            Write-Warning "[$metadataContent]"
            Write-Warning "Resetting metadata"
        }
        else {
            Write-Information "Got metadata"
        }
    }

    if (-not $metadata) {
        Write-Warning "No metadata found, creating new"
        $metadata = @{
            LastBuildNum = 0
            LastVersions = @{
                $VersionKey = 0
            }
        }

        $createGistResp = Invoke-WebRequest -Headers $apiHeaders -Uri $gistsApiUrl -ErrorAction Stop -Method Post -Body (@{
            public = $false
            files = @{
                $metadataFilename = @{
                    content = @"
// THIS FILE IS AUTO-GENERATED AND MANAGED BY GITHUB ACTIONS. MANUAL MODIFICATIONS
// CAN BREAK THINGS IF YOU DO NOT KNOW WHAT YOU ARE DOING! *YOU* HAVE BEEN WARNED!
($metadata | ConvertTo-Json)
"@
                }
            }
        } | ConvertTo-Json)
        $createGist = $createGistResp.Content | ConvertFrom-Json -AsHashtable
        $metadataGist = $createGist
    }

    $lastBuildNum = [int]($metadata.LastBuildNum)
    if (-not $metadata.LastVersions) {
        Write-Warning "No version-specific build numbers; ADDING"
        $metadata.LastVersions = @{}
    }
    Write-Information "Last Build Number: [$($lastBuildNum)]"
    $lastVersBNum = [int]($metadata.LastVersions["$VersionKey"])
    Write-Information "Last Version Build Number: [$($lastVersBNum)]"

    $lastBuildNum += 1
    $lastVersBNum += 1

    $metadata.LastBuildNum             = $lastBuildNum
    $metadata.LastVersions.$VersionKey = $lastVersBNum

    Write-Information "Updating metadata..."
    $patchGistUrl = "$gistsApiUrl/$($metadataGist.id)"
    $patchGistResp = Invoke-WebRequest -Headers $apiHeaders -Uri $patchGistUrl -ErrorAction Stop -Method Patch -Body (@{
        files = @{
            $metadataFilename = @{
                content = @"
/* THIS FILE IS AUTO-GENERATED AND MANAGED BY GITHUB ACTIONS. MANUAL MODIFICATIONS
** CAN BREAK THINGS IF YOU DO NOT KNOW WHAT YOU ARE DOING! *YOU* HAVE BEEN WARNED!
*/
$($metadata | ConvertTo-Json)
"@
            }
        }
    } | ConvertTo-Json)

    Write-Information "Exporting build numbers to environment and output"
    $env:THIS_BUILD_NUM = $lastBuildNum
    $env:VERS_BUILD_NUM = $lastVersBNum

    ## This is based on the convention defined in:
    ##  https://github.com/actions/toolkit/blob/master/packages/core/src/command.ts
    ##  https://github.com/actions/toolkit/blob/master/packages/core/src/core.ts
    Write-Host "::set-env name=THIS_BUILD_NUM::$lastBuildNum"
    Write-Host "::set-env name=VERS_BUILD_NUM::$lastVersBNum"
    Write-Host "::set-output name=THIS_BUILD_NUM::$lastBuildNum"
    Write-Host "::set-output name=VERS_BUILD_NUM::$lastVersBNum"
}
catch {
    Write-Error "Fatal exception:  $($Error[0])"
    return
}