"use client";
import React from "react";
import { Button } from "@workspace/ui/components/button";
import { HoverBorderGradient } from "@workspace/ui/components/hover-border-gradient";
import { motion } from "motion/react";
import { LampContainer } from "@workspace/ui/components/lamp";
import Link from "next/link";

export function Hero() {
  return (
    <LampContainer>
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="w-full"
      >
        {/* Hero Content Container */}
        <div className="mx-auto max-w-4xl text-center p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Announcement Banner */}
          <div className="flex justify-center mb-4 md:mb-5 lg:mb-6">
            <HoverBorderGradient
              as="div"
              containerClassName="rounded-full"
              className="bg-background/80 backdrop-blur text-foreground px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full border border-border/20"
            >
              🎉 Fall 2025 registration is now open!
            </HoverBorderGradient>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 md:mb-4 lg:mb-5 text-foreground">
            Computer Science Club
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground mb-6 md:mb-7 lg:mb-8 max-w-2xl mx-auto px-4">
            St. Cloud State University's student computing community
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-base md:text-lg"
            >
              <a href="https://discord.gg/zeFSpn3VJ9" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Join Our Discord
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-6 md:px-8 py-5 md:py-6 text-base md:text-lg" 
              asChild
            >
              <Link href="/about">
                About Us 
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </LampContainer>
  );
} 