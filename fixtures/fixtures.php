<?php
require_once 'vendor/autoload.php';
use GuzzleHttp\Client;

class Parser
{
    public function getPlayers(string $source): array
    {
        $doc = new DOMDocument();
        libxml_use_internal_errors(true);
        $doc->loadHTML($source);
        libxml_clear_errors();

        $xpath = new DOMXPath($doc);
        $rows = $xpath->query('//*[@id="yw1"]//tbody/tr');

        $players = [];
        foreach ($rows as $tr) {
            $numberTd = $xpath->query('.//td[1]', $tr)->item(0);
            $numberDiv = $xpath->query('.//td[1]//div', $tr)->item(0);
            $playerLink = $xpath->query('.//td[2]//table//td[contains(@class,"hauptlink")]//a', $tr)->item(0);
            $positionTd = $xpath->query('.//td[2]//table//tr[2]//td', $tr)->item(0);
            $captainIcon = $xpath->query('.//td[2]//table//td[contains(@class,"hauptlink")]//span[contains(@class,"kapitaenicon")]', $tr)->item(0);
            $dobTd = $xpath->query('.//td[3]', $tr)->item(0);
            $natImg = $xpath->query('.//td[4]//img[1]', $tr)->item(0);
            $marketTd = $xpath->query('.//td[5]', $tr)->item(0);

            if (!$playerLink) {
                continue;
            }

            $dobRaw = $dobTd ? trim($dobTd->textContent) : '';
            $dob = preg_match('/(\d{2}\/\d{2}\/\d{4})/', $dobRaw, $m) ? $m[1] : $dobRaw;

            $marketValue = null;
            if ($marketTd) {
                $marketLink = $xpath->query('.//a', $marketTd)->item(0);
                $marketRaw = $marketLink ? trim($marketLink->textContent) : trim($marketTd->textContent);
                $marketValue = $marketRaw !== '-' && $marketRaw !== '' ? $marketRaw : null;
            }

            $players[] = [
                'number'       => $numberDiv ? trim($numberDiv->textContent) : null,
                'position_group' => $numberTd ? $numberTd->getAttribute('title') : null,
                'name'         => trim($playerLink->textContent),
                'href'         => $playerLink->getAttribute('href'),
                'is_captain'   => $captainIcon !== null,
                'position'     => $positionTd ? trim($positionTd->textContent) : null,
                'date_of_birth' => $dob ?: null,
                'nationality'  => $natImg ? $natImg->getAttribute('title') : null,
                'market_value' => $marketValue,
            ];
        }

        return $players;
    }

    public function getTeams(string $source): array
    {
        $doc = new DOMDocument();
        libxml_use_internal_errors(true);
        $doc->loadHTML($source);
        libxml_clear_errors();

        $xpath = new DOMXPath($doc);
        $rows = $xpath->query('//*[@id="yw1"]//tbody/tr');

        $teams = [];
        foreach ($rows as $tr) {
            $a = $xpath->query('.//td[1]//a', $tr)->item(0);

            if ($a) {
                $teams[] = [
                    'title' => $a->getAttribute('title'),
                    'href'  => $a->getAttribute('href'),
                ];
            }
        }

        return $teams;
    }
}

$fixtures = [
    'italy' => [
        'IT1' => 'https://www.transfermarkt.com/serie-a/startseite/wettbewerb/IT1',
        'IT2' => 'https://www.transfermarkt.com/serie-b/startseite/wettbewerb/IT2',
        'IT3A' => 'https://www.transfermarkt.com/serie-c-girone-a/startseite/wettbewerb/IT3A',
        'IT3B' => 'https://www.transfermarkt.com/serie-c-girone-b/startseite/wettbewerb/IT3B',
        'IT3C' => 'https://www.transfermarkt.com/serie-c-girone-c/startseite/wettbewerb/IT3C',
        'IT4A' => 'https://www.transfermarkt.com/serie-d-girone-a/startseite/wettbewerb/IT4A',
        'IT4B' => 'https://www.transfermarkt.com/serie-d-girone-b/startseite/wettbewerb/IT4B',
        'IT4C' => 'https://www.transfermarkt.com/serie-d-girone-c/startseite/wettbewerb/IT4C',
        'IT4D' => 'https://www.transfermarkt.com/serie-d-girone-d/startseite/wettbewerb/IT4D',
    ],
    'spain' => [
        'ES1' => 'https://www.transfermarkt.com/laliga/startseite/wettbewerb/ES1',
        'ES2' => 'https://www.transfermarkt.com/laliga2/startseite/wettbewerb/ES2',
        'E3G1' => 'https://www.transfermarkt.com/primera-division-r-f-e-f-grupo-i/startseite/wettbewerb/E3G1',
        'E3G2' => 'https://www.transfermarkt.com/primera-division-r-f-e-f-grupo-ii/startseite/wettbewerb/E3G2',
    ],
    'england' => [
        'GB1' => 'https://www.transfermarkt.com/premier-league/startseite/wettbewerb/GB1',
        'GB2' => 'https://www.transfermarkt.com/championship/startseite/wettbewerb/GB2',
        'GB3' => 'https://www.transfermarkt.com/league-one/startseite/wettbewerb/GB3',
        'GB4' => 'https://www.transfermarkt.com/league-two/startseite/wettbewerb/GB4',
    ],
    'germany' => [
        'L1' => 'https://www.transfermarkt.com/bundesliga/startseite/wettbewerb/L1',
        'L2' => 'https://www.transfermarkt.com/2-bundesliga/startseite/wettbewerb/L2',
        'L3' => 'https://www.transfermarkt.com/3-liga/startseite/wettbewerb/L3',
    ],
    'france' => [
        'FR1' => 'https://www.transfermarkt.com/ligue-1/startseite/wettbewerb/FR1',
        'FR2' => 'https://www.transfermarkt.com/ligue-2/startseite/wettbewerb/FR2',
    ],
    'ukraine' => [
        'UKR1' => 'https://www.transfermarkt.com/premier-liga/startseite/wettbewerb/UKR1',
        'UKR2' => 'https://www.transfermarkt.com/persha-liga/startseite/wettbewerb/UKR2',
    ],
];

$client = new Client([
    'base_uri' => 'https://www.transfermarkt.com',
    'headers'  => [
        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ],
]);

$parser = new Parser();

fetchLeagues($client, $parser, $fixtures);
fetchPlayers($client, $parser);

function fetchPlayers(Client $client, Parser $parser): void
{
    $teamsJson = file_get_contents('teams.json');
    if (!$teamsJson) {
        echo "teams.json not found. Run fetchLeagues() first." . PHP_EOL;
        return;
    }

    $outputFile = 'players.json';
    $result = file_exists($outputFile)
        ? json_decode(file_get_contents($outputFile), true)
        : [];

    $allTeams = json_decode($teamsJson, true);

    foreach ($allTeams as $country => $leagues) {
        if (!isset($result[$country])) {
            $result[$country] = [];
        }

        foreach ($leagues as $leagueCode => $teams) {
            if (!isset($result[$country][$leagueCode])) {
                $result[$country][$leagueCode] = [];
            }

            foreach ($teams as $team) {
                $teamHref  = $team['href'];
                $teamTitle = $team['title'];

                if (isset($result[$country][$leagueCode][$teamHref])) {
                    echo "Skip [{$country}][{$leagueCode}] {$teamTitle} (already fetched)" . PHP_EOL;
                    continue;
                }

                echo "Fetching players [{$country}][{$leagueCode}] {$teamTitle}: {$teamHref}" . PHP_EOL;

                try {
                    $response = $client->get($teamHref);
                    $players  = $parser->getPlayers($response->getBody()->getContents());

                    $result[$country][$leagueCode][$teamHref] = [
                        'team'    => $teamTitle,
                        'players' => $players,
                    ];

                    file_put_contents($outputFile, json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

                    echo "  → " . count($players) . " players saved." . PHP_EOL;

                    sleep(2);
                } catch (\Exception $e) {
                    echo "Error fetching {$teamHref}: " . $e->getMessage() . PHP_EOL;
                    $result[$country][$leagueCode][$teamHref] = [
                        'team'    => $teamTitle,
                        'players' => [],
                    ];
                }
            }
        }
    }

    echo "All done! Saved to {$outputFile}" . PHP_EOL;
}

function fetchLeagues(Client $client, Parser $parser, array $fixtures): void
{
    $result = [];

    foreach ($fixtures as $country => $leagues) {
        $result[$country] = [];

        foreach ($leagues as $leagueCode => $url) {
            $path = parse_url($url, PHP_URL_PATH);

            echo "Fetching [{$country}][{$leagueCode}]: {$path}" . PHP_EOL;

            try {
                $response = $client->get($path);
                $teams = $parser->getTeams($response->getBody()->getContents());

                $result[$country][$leagueCode] = $teams;

                sleep(1);
            } catch (\Exception $e) {
                echo "Error fetching {$path}: " . $e->getMessage() . PHP_EOL;
                $result[$country][$leagueCode] = [];
            }
        }
    }

    file_put_contents('teams.json', json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "Done! Saved to teams.json" . PHP_EOL;
}
