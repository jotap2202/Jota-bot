"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface Stats {
  total_businesses: number;
  total_locations: number;
  total_cards: number;
  active_cards: number;
  inactive_cards: number;
  total_taps: number;
  avg_taps_per_card: number;
}

interface CardStats {
  id: string;
  short_code: string;
  location_name: string;
  business_name: string;
  tap_count: number;
  is_active: boolean;
  last_tap_at: string | null;
  created_at: string;
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [cardStats, setCardStats] = useState<CardStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Get aggregated stats
        const [
          { data: businesses },
          { data: locations },
          { data: cards },
        ] = await Promise.all([
          supabase.from("businesses").select("id"),
          supabase.from("locations").select("id"),
          supabase.from("nfc_cards").select("*"),
        ]);

        if (businesses && locations && cards) {
          const totalTaps = cards.reduce((sum, card) => sum + card.tap_count, 0);
          const activeCards = cards.filter((c) => c.is_active).length;

          setStats({
            total_businesses: businesses.length,
            total_locations: locations.length,
            total_cards: cards.length,
            active_cards: activeCards,
            inactive_cards: cards.length - activeCards,
            total_taps: totalTaps,
            avg_taps_per_card:
              cards.length > 0 ? Math.round(totalTaps / cards.length) : 0,
          });
        }

        // Get card-level stats
        const { data: cardsWithRelations } = await supabase
          .from("nfc_cards")
          .select(`
            id,
            short_code,
            tap_count,
            is_active,
            last_tap_at,
            created_at,
            location:locations(name),
            business:locations!inner(business_id).business:businesses(name)
          `)
          .order("tap_count", { ascending: false });

        if (cardsWithRelations) {
          const formattedStats = cardsWithRelations.map((card: any) => ({
            id: card.id,
            short_code: card.short_code,
            location_name: card.location?.name || "Unknown",
            business_name: card.business?.name || "Unknown",
            tap_count: card.tap_count,
            is_active: card.is_active,
            last_tap_at: card.last_tap_at,
            created_at: card.created_at,
          }));

          setCardStats(formattedStats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Statistics</h1>
            <p className="text-neutral-600 text-sm mt-1">
              Overall engagement and performance metrics
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-neutral-600 mb-2">
                    Total Taps
                  </p>
                  <p className="text-4xl font-bold text-brand-500">
                    {stats.total_taps}
                  </p>
                  <p className="text-xs text-neutral-600 mt-2">
                    {stats.avg_taps_per_card} avg per card
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-neutral-600 mb-2">
                    Active Cards
                  </p>
                  <p className="text-4xl font-bold text-status-success">
                    {stats.active_cards}
                  </p>
                  <p className="text-xs text-neutral-600 mt-2">
                    of {stats.total_cards} cards
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-neutral-600 mb-2">
                    Locations
                  </p>
                  <p className="text-4xl font-bold text-brand-500">
                    {stats.total_locations}
                  </p>
                  <p className="text-xs text-neutral-600 mt-2">
                    across {stats.total_businesses} businesses
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-neutral-600 mb-2">
                    Inactive Cards
                  </p>
                  <p className="text-4xl font-bold text-status-warning">
                    {stats.inactive_cards}
                  </p>
                  <p className="text-xs text-neutral-600 mt-2">
                    not generating taps
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Card Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-3 font-semibold text-neutral-700">
                      Code
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-neutral-700">
                      Business
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-neutral-700">
                      Location
                    </th>
                    <th className="text-right py-3 px-3 font-semibold text-neutral-700">
                      Taps
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-neutral-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-neutral-700">
                      Last Tap
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cardStats.length > 0 ? (
                    cardStats.map((card) => (
                      <tr key={card.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3 px-3">
                          <code className="bg-neutral-100 px-2 py-1 rounded font-mono text-xs">
                            {card.short_code}
                          </code>
                        </td>
                        <td className="py-3 px-3 text-neutral-900">
                          {card.business_name}
                        </td>
                        <td className="py-3 px-3 text-neutral-900">
                          {card.location_name}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="font-semibold text-brand-500">
                            {card.tap_count}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant={
                              card.is_active ? "success" : "warning"
                            }
                          >
                            {card.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-neutral-600">
                          {card.last_tap_at ? formatDate(card.last_tap_at) : "Never"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-neutral-600"
                      >
                        No cards found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
