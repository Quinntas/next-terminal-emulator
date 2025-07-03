"use client"

import React, {useEffect, useState} from 'react';
import {useTheme} from "@/components/theme-provider";

export const Ps1 = () => {
    const [hostname, setHostname] = useState('localhost');
    const {theme} = useTheme();

    useEffect(() => {
        if (typeof window !== undefined) {
            setHostname(window.location.hostname);
        }
    }, []);

    return (
        <div>
      <span
          style={{
              color: theme.yellow,
          }}
      >
        guest
      </span>
            <span
                style={{
                    color: theme.white,
                }}
            >
        @
      </span>
            <span
                style={{
                    color: theme.green,
                }}
            >
        {hostname}
      </span>
            <span
                style={{
                    color: theme.white,
                }}
            >
        :$ ~
      </span>
        </div>
    );
};

export default Ps1;
